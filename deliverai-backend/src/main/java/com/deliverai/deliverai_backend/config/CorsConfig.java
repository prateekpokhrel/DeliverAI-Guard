package com.deliverai.deliverai_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Applies CORS to all endpoints
                        .allowedOrigins("https://deliver-ai-guard-frontend.vercel.app/") // Your specific frontend URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS is crucial for the preflight check
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}