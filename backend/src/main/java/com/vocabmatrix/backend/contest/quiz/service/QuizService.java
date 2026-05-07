// src/main/java/com/vocabmatrix/backend/contest/quiz/service/QuizService.java

package com.vocabmatrix.backend.contest.quiz.service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.contest.quiz.dto.*;
import com.vocabmatrix.backend.contest.quiz.entity.QuizResult;
import com.vocabmatrix.backend.contest.quiz.repository.QuizResultRepository;
import com.vocabmatrix.backend.vocabulary.entity.WordDefinition;
import com.vocabmatrix.backend.vocabulary.repository.WordDefinitionRepository;

@Service
@RequiredArgsConstructor
public class QuizService {

    // 注入資料庫 Repository，負責查詢單字定義
    private final WordDefinitionRepository wordDefinitionRepository;

    // 注入資料庫 Repository，負責儲存測驗結果
    private final QuizResultRepository quizResultRepository;

    // 注入 Redis 操作工具，用來暫存答案
    // StringRedisTemplate 代表 key 和 value 都是字串格式
    private final StringRedisTemplate redisTemplate;

    // 注入 JSON 工具，負責 Java 物件 ↔ JSON 字串 的轉換
    private final ObjectMapper objectMapper;

    // Redis key 的前綴，完整格式是 "quiz:session:{userId}"
    // 例如 userId=42，key 就是 "quiz:session:42"
    // 每個使用者有自己獨立的 key，不會互相干擾
    private static final String SESSION_KEY = "quiz:session:";

    // Redis 的資料存活時間，30 分鐘後自動刪除
    // 超時代表使用者放棄這場測驗
    private static final Duration SESSION_TTL = Duration.ofMinutes(30);


    // =====================================================================
    // 出題：從資料庫隨機抽題，答案藏進 Redis，題目送給前端
    // =====================================================================
    public List<QuizQuestionDTO> getQuestions(int size, Long userId)
            throws JsonProcessingException {

        // Step 1: 只撈所有 definition 的 id（不撈完整資料，節省記憶體）
        List<Long> allIds = new ArrayList<>(
                wordDefinitionRepository.findAllIds()
        );

        // Step 2: 在 Java 裡 shuffle，確保每次題目順序都不同
        // 用subList配合參數size取前幾個題目的id，並用 Math.min 防止要求的題數比資料庫總筆數還多
        Collections.shuffle(allIds);
        List<Long> selectedIds = allIds.subList(0, Math.min(size, allIds.size()));

        // Step 3: 用抽到的id們(selectedIds)查他們各自完整的單字定義資料
        List<WordDefinition> selected = new ArrayList<>(
                wordDefinitionRepository.findAllById(selectedIds)
        );

        // answerMap 存的是 { "definitionId": "單字（正確答案）" }
        // 這份 Map 只會存進 Redis，絕對不會送給前端
        Map<String, String> answerMap = new HashMap<>();

        // questions 是要回傳給前端的題目列表，裡面沒有答案
        List<QuizQuestionDTO> questions = new ArrayList<>();

        // 用for迴圈遍歷所有定義id（definitionId），將id跟他對應的單字（正確答案）依序存進Map（anwerMap）
        for (WordDefinition def : selected) {
            // 正確答案是單字本身（例如 "apple"）
            String answer = def.getWord().getWord();

            // 以 definitionId 為 key，把答案存進 answerMap
            answerMap.put(def.getId().toString(), answer);

            // 把題目資料包成 DTO，注意這裡刻意沒有放 answer
            // 前端收到的 DTO 只有定義、詞性等資訊，看不到答案
            QuizQuestionDTO dto = new QuizQuestionDTO();
            dto.setDefinitionId(def.getId());
            dto.setDefinitionEn(def.getDefinitionEn());   // 英文定義（題目）
            dto.setDefinitionCn(def.getDefinitionCn());   // 中文定義（提示）
            dto.setPos(def.getPos());                     // 詞性（n. / v. 等）
            dto.setCategory(def.getCategories() != null && def.getCategories().length > 0
                    ? def.getCategories()[0] : "Mixed");  // 取第一個分類，沒有就用 Mixed
            questions.add(dto);
        }

        // Step 4: 把 answerMap 轉成 JSON 字串存進 Redis
        // writeValueAsString() 把 Map 轉成 '{"101":"apple","102":"run"}' 這樣的字串
        // Redis 只能存字串，所以需要先轉換
        String redisKey = SESSION_KEY + userId;
        redisTemplate.opsForValue().set(
                redisKey,
                objectMapper.writeValueAsString(answerMap),
                SESSION_TTL  // 30 分鐘後自動過期
        );

        // 只回傳題目，答案留在 Redis 裡
        return questions;
    }


    // =====================================================================
    // 即時驗證：使用者答完一題，馬上比對是否正確
    // 只回傳對/錯，不透露正確答案
    // =====================================================================
    public QuizCheckResponseDTO checkAnswer(Long userId, Long definitionId, String answer) {

        // 從 Redis 取出答案
        String redisKey = SESSION_KEY + userId;  // Redis 的 Key
        String answerJson = redisTemplate.opsForValue().get(redisKey); // Redis 的 Value（從 Redis 取出這場測驗的答案 JSON 字串）

        // 如果取不到JSON字串（Redis的Value），代表 session 已過期（30 分鐘到了）或根本沒開始測驗
        if (answerJson == null) {
            throw new RuntimeException("Quiz session expired. Please start a new quiz.");
        }

        try {
            // 把 JSON 字串反序列化回 Map
            // TypeReference 是告訴 ObjectMapper 要轉成 Map<String, String> 型別
            Map<String, String> answerMap = objectMapper.readValue(
                    answerJson, new TypeReference<Map<String, String>>() {});

            // 用 definitionId 找到這題的正確答案
            String correctAnswer = answerMap.get(definitionId.toString());

            // equalsIgnoreCase 忽略大小寫
            // trim() 去除前後空白，避免使用者不小心多打空格
            boolean correct = correctAnswer != null &&
                    correctAnswer.equalsIgnoreCase(answer.trim());

            // 只回傳 true/false，正確答案不給前端
            return new QuizCheckResponseDTO(correct);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse answer map.");
        }
    }


    // =====================================================================
    // 儲存結果：測驗結束，後端重新驗證所有答案，計分後存進資料庫
    // @Transactional 確保資料庫操作全部成功或全部失敗，不會存到一半
    // =====================================================================
    @Transactional
    public QuizResultResponseDTO saveResult(Long userId, QuizResultRequestDTO request)
            throws JsonProcessingException {

        // 從 Redis 取出答案
        String redisKey = SESSION_KEY + userId;  // Redis 的 Key
        String answerJson = redisTemplate.opsForValue().get(redisKey); // Redis 的 Value（從 Redis 取出這場測驗的答案 JSON 字串）

        // 如果取不到JSON字串（Redis的Value），代表 session 已過期（30 分鐘到了）
        if (answerJson == null) {
            throw new RuntimeException("Quiz session expired or not found. Please start a new quiz.");
        }

        // 把 Redis 裡的答案 JSON 字串還原成 Map
        Map<String, String> answerMap = objectMapper.readValue(
                answerJson, new TypeReference<Map<String, String>>() {});

        int correctCount = 0;
        int wrongCount = 0;
        List<Map<String, Object>> wrongWords = new ArrayList<>();  // 答錯的單字，之後錯題複習用
        List<QuizResultResponseDTO.QuestionReviewDTO> review = new ArrayList<>();  // 每題的詳細結果

        // LinkedHashSet 有兩個特性：
        // 1. 不允許重複（防止同一題被計分兩次）
        // 2. 保留插入順序（題目順序不會亂掉）
        Set<Long> seen = new LinkedHashSet<>();

        for (QuizResultRequestDTO.UserAnswerDTO userAnswer : request.getAnswers()) {

            // 資料庫的definitionId
            Long defId = userAnswer.getDefinitionId();

            // 用seen.add()嘗試把 defId 加進 seen，如果已經存在會回傳 false 代表這個 id 已經出現過，所以用continue跳過不重複計分
            if (!seen.add(defId)) continue;

            // 從 answerMap 取出這題的正確答案
            String correctAnswer = answerMap.get(defId.toString());

            //  如果這個 defId（資料庫的definitionId） 不在這場session的answerMap 裡，代表前端可能在偽造題目，直接忽略。
            if (correctAnswer == null) continue;

            // 這個測驗有兩次作答機會，任一次答對都算對
            // -> firstAttempt是第一次輸入的答案
            // -> secondAttempt是第二次輸入的答案（第二次輸入的答案可以是null，因為第一次就答對就沒必要輸入第二次）
            boolean firstCorrect = correctAnswer.equalsIgnoreCase(userAnswer.getFirstAttempt());
            boolean secondCorrect = userAnswer.getSecondAttempt() != null
                    && correctAnswer.equalsIgnoreCase(userAnswer.getSecondAttempt());
            boolean isCorrect = firstCorrect || secondCorrect;

            //  根據使用者答案的對錯分別給出對應的處理
            if (isCorrect) {
                correctCount++;
            } else {
                wrongCount++;

                // 答錯的話，把 wordId 和單字存起來，方便之後做錯題複習功能
                wordDefinitionRepository.findById(defId).ifPresent(def -> {
                    Map<String, Object> wrongWord = new HashMap<>();
                    wrongWord.put("wordId", def.getWord().getId());
                    wrongWord.put("word", correctAnswer);
                    wrongWords.add(wrongWord);
                });
            }

            // 查這題的英文定義，結果畫面要顯示每題的題目內容
            String definitionEn = wordDefinitionRepository.findById(defId)
                    .map(d -> d.getDefinitionEn())
                    .orElse("");

            // 把這題的詳細資訊加進 review 列表
            // 注意：correctAnswer 在遊戲中不透露，測驗結束後才在這裡揭露
            review.add(QuizResultResponseDTO.QuestionReviewDTO.builder()
                    .definitionId(defId)
                    .definitionEn(definitionEn)
                    .correctAnswer(correctAnswer)
                    .firstAttempt(userAnswer.getFirstAttempt())
                    .secondAttempt(userAnswer.getSecondAttempt())
                    .correct(isCorrect)
                    .build());
        }

        // 把答錯的單字列表轉成 JSON 字串，存進資料庫
        String wrongWordsJson = objectMapper.writeValueAsString(wrongWords);

        // 建立測驗結果物件，準備存進資料庫
        QuizResult result = new QuizResult();
        result.setUserId(userId);
        result.setCategory("Mixed");
        result.setCorrectCount(correctCount);
        result.setWrongCount(wrongCount);
        result.setTotalQuestions(seen.size());         // 用 seen.size() 確保去重後的題數
        result.setDurationSeconds(request.getDurationSeconds());
        result.setWrongWords(wrongWordsJson);

        QuizResult saved = quizResultRepository.save(result);

        // 測驗完成，立刻清掉 Redis session
        // 防止同一份答案被重複送出，造成成績重複儲存
        redisTemplate.delete(redisKey);

        // 把儲存好的結果轉成 DTO 回傳，並附上每題的詳細 review
        QuizResultResponseDTO dto = QuizResultResponseDTO.from(saved);
        dto.setReview(review);
        return dto;
    }


    // =====================================================================
    // 查歷史紀錄：cursor-based 分頁，適合無限捲動的 UI
    // 第一次呼叫傳 OffsetDateTime.now()
    // 之後每次傳上一批最後一筆的 completedAt，往前撈更早的紀錄
    // =====================================================================
    public List<QuizResult> getUserHistory(Long userId, OffsetDateTime cursor, int size) {
        return quizResultRepository.findByUserIdOrderByCompletedAtDesc(
                userId, cursor, PageRequest.of(0, size));
    }
}