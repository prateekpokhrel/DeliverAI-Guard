package com.deliverai.deliverai_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 1. Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // 2. Exact frontend URL (No trailing slash)
        config.setAllowedOrigins(List.of("https://deliver-ai-guard-frontend.vercel.app"));

        // 3. Explicitly list allowed headers (Wildcards can sometimes fail with Spring Security)
        config.setAllowedHeaders(Arrays.asList(
                "Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"
        ));

        // 4. Explicitly allow methods, especially OPTIONS for preflight
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply to all API endpoints
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

//https://deliver-ai-guard-frontend.vercel.app/