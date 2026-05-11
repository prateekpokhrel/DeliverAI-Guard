package com.deliverai.deliverai_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. THIS IS THE MAGIC LINE FOR CORS
                // Tells Spring Security to use your CorsFilter first before blocking preflight requests
                .cors(Customizer.withDefaults())

                // 2. Disable CSRF for REST APIs
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow public access from your Vercel frontend to the delivery endpoints
                        .requestMatchers("/api/delivery/**").permitAll()

                        // Secure everything else
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}