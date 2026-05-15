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

        CorsConfiguration config =
                new CorsConfiguration();

        // =====================================
        // ALLOW CREDENTIALS
        // =====================================

        config.setAllowCredentials(true);

        // =====================================
        // ALLOW FRONTEND DOMAINS
        // =====================================

        config.setAllowedOriginPatterns(List.of(

                // Railway frontend
                "https://*.up.railway.app",

                // Vercel frontend
                "https://*.vercel.app",

                // Localhost development
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        // =====================================
        // ALLOW HEADERS
        // =====================================

        config.addAllowedHeader("*");
        // =====================================
        // ALLOW METHODS
        // =====================================

        config.addAllowedMethod("*");

        // =====================================
        // EXPOSE HEADERS
        // =====================================

        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type"
        ));

        // =====================================
        // APPLY CONFIG
        // =====================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return new CorsFilter(source);
    }
}