// src/main/java/com/vocabmatrix/backend/config/SecurityConfig.java

package com.vocabmatrix.backend.config;

import java.util.Arrays;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.vocabmatrix.backend.auth.filter.JwtAuthenticationFilter;
import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import com.vocabmatrix.backend.config.oauth.CustomAuthorizationRequestResolver;
import com.vocabmatrix.backend.oauth.handler.OAuthLoginSuccessHandler;
import com.vocabmatrix.backend.oauth.service.OAuth2LoginService;
import com.vocabmatrix.backend.oauth.service.OidcLoginService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OidcLoginService oidcLoginService;
    private final OAuth2LoginService oauth2LoginService;
    private final OAuthLoginSuccessHandler oAuthLoginSuccessHandler;
    private final ClientRegistrationRepository clientRegistrationRepository;
    private final JwtTokenService jwtTokenService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http

                // 開啟 CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 關閉 CSRF 保護
                .csrf(csrf -> csrf.disable())

                // 設定 Session 為無狀態
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 關閉 Spring Security 內建的預設登入機制
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // 設定權限
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/otp/**",
                                "/api/oauth2/**",
                                "/login/oauth2/**",
                                "/uploads/**",
                                "/api/uploads/**"
                        ).permitAll()

                        // 公開所有 /api/vocabulary/ 下的路徑
                        .requestMatchers("/api/vocabulary/**").permitAll()

                        // 排行榜公開，未登入也能看
                        .requestMatchers("/api/contest/leaderboard/**").permitAll()

                        // 除了上面permitAll() 裡的端點之外，其他所有請求都必須登入才能存取
                        .anyRequest().authenticated()
                )

                // 設定 OAuth2 登錄（例如「透過 Google 登入」或「透過 FB 登入」）的自定義行為。
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/api/oauth2/authorization")
                                .authorizationRequestResolver(
                                        new CustomAuthorizationRequestResolver(
                                                clientRegistrationRepository,
                                                jwtTokenService) // 傳入 JwtTokenService
                                )
                        )
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(oidcLoginService)
                                .userService(oauth2LoginService)
                        )
                        .successHandler(oAuthLoginSuccessHandler)
                        .failureUrl(frontendUrl + "/auth/login?error=oauth2_failed")
                )

                // 在執行 LogoutFilter 之前，確保先執行 jwtAuthenticationFilter進行過濾
                .addFilterBefore(jwtAuthenticationFilter, LogoutFilter.class)

                // 生成
                .build();
    }

    // 讓瀏覽器允許來自前端的請求（本地開發 + 正式環境）
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:3000",
                frontendUrl
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}