// src/main/java/com/vocabmatrix/backend/config/FileStorageConfig.java

package com.vocabmatrix.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 取得專案根目錄下的 uploads 資料夾路徑
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

        // 2. 轉換為檔案系統 URL (這會自動處理 file:/// 前綴和 Mac/Linux 的斜線)
        String uploadUri = uploadPath.toUri().toString();

        // 3. 註冊映射
        // 確保 /uploads/** 和 /api/uploads/** 都能對應到該資料夾
        registry.addResourceHandler("/uploads/**", "/api/uploads/**")
                .addResourceLocations(uploadUri);

        // 除錯用：可以在後端 log 看到它到底指向哪裡
        System.out.println("====== [File Config] 圖片實體路徑: " + uploadUri);
    }
}