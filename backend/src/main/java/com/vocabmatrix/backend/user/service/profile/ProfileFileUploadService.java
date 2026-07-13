// src/main/java/com/vocabmatrix/backend/user/service/profile/ProfileFileUploadService.java

package com.vocabmatrix.backend.user.service.profile;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ProfileFileUploadService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp"
    );

    public String uploadAvatar(MultipartFile file, Long userId) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("檔案不能為空");
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("不支援的檔案格式，僅支援 JPG, PNG, WEBP");
        }

        // 產生唯一檔名
        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
        String key = "avatars/avatar_" + userId + "_" + UUID.randomUUID() + ext;

        // 建立 S3 Client(自動使用 EC2 的 IAM Role,不需要 Access Key)
        S3Client s3 = S3Client.builder()
                .region(Region.of(region))
                .build();

        // 上傳到 S3
        s3.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // 回傳 S3 公開網址
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }

    public void deleteAvatarByUrl(String avatarUrl, Long userId) {
        // 只處理 S3 網址,OAuth2 外部連結跳過
        if (avatarUrl == null || !avatarUrl.contains(".amazonaws.com/")) {
            return;
        }

        try {
            // 從網址提取 S3 key
            // 網址格式:https://bucket-name.s3.region.amazonaws.com/avatars/avatar_123_xxx.jpg
            String key = avatarUrl.substring(avatarUrl.indexOf(".amazonaws.com/") + ".amazonaws.com/".length());

            // 安全檢查:確保這個 key 屬於這個使用者
            if (key.contains("avatar_" + userId + "_")) {
                S3Client s3 = S3Client.builder()
                        .region(Region.of(region))
                        .build();

                s3.deleteObject(
                        DeleteObjectRequest.builder()
                                .bucket(bucketName)
                                .key(key)
                                .build()
                );
                log.info("成功刪除使用者 {} 的舊頭像: {}", userId, key);
            }
        } catch (Exception e) {
            log.error("刪除 S3 檔案失敗: {}", e.getMessage());
        }
    }
}