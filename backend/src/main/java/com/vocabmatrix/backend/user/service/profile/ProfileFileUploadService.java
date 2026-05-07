// src/main/java/com/vocabmatrix/backend/user/service/profile/ProfileFileUploadService.java

package com.vocabmatrix.backend.user.service.profile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
@Slf4j
public class ProfileFileUploadService {

    // 讀取 application.yml 裡的 file.upload.dir 設定
    @Value("${file.upload.dir:uploads/avatars/}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");

    /**
     * 處理檔案上傳
     */
    public String uploadAvatar(MultipartFile file, Long userId) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("檔案不能為空");

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("不支援的檔案格式，僅支援 JPG, PNG, WEBP");
        }

        // 確保目錄存在
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 產生唯一檔名：avatar_用戶ID_隨機碼.副檔名
        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains(".")) ?
                originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
        String filename = "avatar_" + userId + "_" + UUID.randomUUID() + ext;

        // 儲存檔案
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        // 返回 Web 訪問路徑
        return "/uploads/avatars/" + filename;
    }

    /**
     * 刪除舊頭像（只刪除本系統上傳的，不刪除 OAuth2 的外部連結）
     */
    public void deleteAvatarByUrl(String avatarUrl, Long userId) {
        if (avatarUrl == null || !avatarUrl.contains("/uploads/avatars/")) {
            return;
        }

        try {
            // 從 URL 提取檔名
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);

            // 安全檢查：確保檔名開頭符合該用戶 ID，防止越權刪除
            if (filename.startsWith("avatar_" + userId + "_")) {
                Path filePath = Paths.get(uploadDir).resolve(filename);
                Files.deleteIfExists(filePath);
                log.info("成功刪除使用者 {} 的舊頭像: {}", userId, filename);
            }
        } catch (IOException e) {
            log.error("刪除實體檔案失敗: {}", e.getMessage());
        }
    }
}