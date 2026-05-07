// src/main/java/com/vocabmatrix/backend/user/dto/oauth/LinkedProviderDTO.java

package com.vocabmatrix.backend.user.dto.oauth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkedProviderDTO {
    private String provider_name;      // 對應前端的 provider_name
    private String provider_email;     // 對應前端的 provider_email
    private Long user_id;              // 使用者 ID
}