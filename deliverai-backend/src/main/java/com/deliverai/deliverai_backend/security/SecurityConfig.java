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
                // --- THE CRUCIAL LINE ---
                // This tells Spring Security to find your CorsFilter and run it first
                .cors(Customizer.withDefaults())

                // Disable CSRF for REST APIs
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // Allow public access to your predict endpoint (adjust if you have specific paths)
                        .requestMatchers("/api/delivery/**").permitAll()

                        // Secure everything else (if you are using JWT)
                        .anyRequest().authenticated()
                );

        // Note: If you add your JwtService filter later, add it using:
        // .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}