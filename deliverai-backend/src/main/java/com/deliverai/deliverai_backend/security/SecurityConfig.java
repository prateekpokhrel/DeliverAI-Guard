package com.deliverai.deliverai_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // =====================================
    // PASSWORD ENCODER
    // =====================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =====================================
    // SECURITY FILTER
    // =====================================

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Enable CORS
                .cors(Customizer.withDefaults())

                // Disable CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // Authorization Rules
                .authorizeHttpRequests(auth -> auth

                        // Allow OPTIONS requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Public APIs
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/delivery/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/monitoring/**"
                        ).permitAll()

                        .requestMatchers(
                                "/ws/**"
                        ).permitAll()

                        // Everything else
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}