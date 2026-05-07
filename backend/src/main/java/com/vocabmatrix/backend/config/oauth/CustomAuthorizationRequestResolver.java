// src/main/java/com/vocabmatrix/backend/config/oauth/CustomAuthorizationRequestResolver.java

package com.vocabmatrix.backend.config.oauth;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import io.jsonwebtoken.Claims;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;
    private final JwtTokenService jwtTokenService;

    public CustomAuthorizationRequestResolver(
            ClientRegistrationRepository repo,
            JwtTokenService jwtTokenService) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(
                repo, "/api/oauth2/authorization");
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest authRequest = defaultResolver.resolve(request);
        return authRequest != null ? customizeAuthRequest(authRequest, request) : null;
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        OAuth2AuthorizationRequest authRequest = defaultResolver.resolve(request, clientRegistrationId);
        return authRequest != null ? customizeAuthRequest(authRequest, request) : null;
    }

    private OAuth2AuthorizationRequest customizeAuthRequest(
            OAuth2AuthorizationRequest authRequest, HttpServletRequest request) {

        String linking = request.getParameter("linking");
        String token = request.getParameter("token");

        if ("true".equals(linking)) {
            log.info("✓ 偵測到 linking=true，將標記存入 Session");

            if (token != null && !token.isEmpty() && !"null".equals(token)) {
                try {
                    Claims claims = jwtTokenService.validateAccessToken(token);
                    Long userId = Long.parseLong(claims.getSubject());

                    log.info("✓ 從 Token 解析出使用者 ID: {}", userId);

                    request.getSession().setAttribute("oauth_linking", true);
                    request.getSession().setAttribute("oauth_linking_user_id", userId);
                } catch (Exception e) {
                    log.error("無法解析使用者 Token: {}", e.getMessage());
                    request.getSession().setAttribute("oauth_linking", true);
                }
            } else {
                log.warn("綁定流程但未提供有效 token，token值: {}", token);
                request.getSession().setAttribute("oauth_linking", true);
            }

            Map<String, Object> additionalParams = new HashMap<>(authRequest.getAdditionalParameters());
            additionalParams.put("linking", "true");

            return OAuth2AuthorizationRequest.from(authRequest)
                    .additionalParameters(additionalParams)
                    .build();
        }

        return authRequest;
    }
}