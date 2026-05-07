// src/main/java/com/vocabmatrix/backend/common/util/IpUtils.java

package com.vocabmatrix.backend.common.util;

import java.net.InetAddress;
import java.net.UnknownHostException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * IP 地址工具類，用於安全地從 HttpServletRequest 中獲取客戶端的真實 IP 地址。
 * 涵蓋了多種代理 Header 檢查和 IP 有效性驗證。
 */
@Slf4j
public final class IpUtils { // 設置為 final，防止被繼承

    // 擴充後的代理 Header 候選列表，按優先級排列
    private static final String[] IP_HEADER_CANDIDATES = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
    };

    /**
     * 私有建構子，防止實例化工具類。
     */
    private IpUtils() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }


    /**
     * 取得客戶端真實 IP
     * @param request HttpServletRequest
     * @return 客戶端 IP
     */
    public static String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return "0.0.0.0";
        }

        // 1. 檢查各種可能的 header
        for (String header : IP_HEADER_CANDIDATES) {
            String ip = request.getHeader(header);

            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // X-Forwarded-For 可能包含多個 IP (client, proxy1, proxy2)，取第一個
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }

                // 找到第一個有效 IP 就返回
                if (isValidIp(ip)) {
                    log.debug("從 header {} 取得有效 IP: {}", header, ip);
                    return ip;
                } else {
                    // 如果是無效的 IP，繼續檢查下一個 header
                    log.debug("從 header {} 取得無效 IP: {}，繼續檢查下一個", header, ip);
                }
            }
        }

        // 2. 如果都沒有或都無效，使用 RemoteAddr
        String ip = request.getRemoteAddr();

        // 3. 處理 IPv6 本地回環地址轉換到 IPv4，常見於本地開發環境
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            ip = "127.0.0.1";
        }

        log.debug("最終取得 IP: {}", ip);
        return ip != null ? ip : "0.0.0.0";
    }

    /**
     * 驗證 IP 格式是否有效
     * @param ip IP 位址
     * @return true: 有效, false: 無效
     */
    public static boolean isValidIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }

        // 使用 InetAddress 驗證，支援 IPv4 + IPv6
        try {
            // 嘗試解析 IP 地址，如果格式不正確或主機無法解析，會拋出例外
            InetAddress.getByName(ip);
            return true;
        } catch (UnknownHostException e) {
            return false;
        }
    }

    /**
     * 判斷是否為內網 IP
     * @param ip IP 位址
     * @return true: 內網, false: 外網
     */
    public static boolean isInternalIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }

        try {
            InetAddress inet = InetAddress.getByName(ip);
            // 內網 IP 範圍（自動涵蓋 10.*, 172.16.*~172.31.*, 192.168.*, 127.*）
            // isSiteLocalAddress() 檢查私有地址範圍，isLoopbackAddress() 檢查 127.0.0.1
            return inet.isSiteLocalAddress() || inet.isLoopbackAddress();
        } catch (UnknownHostException e) {
            // 如果 IP 無效，則視為非內部 IP
            return false;
        }
    }
}