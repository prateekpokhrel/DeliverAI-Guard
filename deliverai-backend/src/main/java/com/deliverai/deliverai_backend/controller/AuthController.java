package com.deliverai.deliverai_backend.controller;

import com.deliverai.deliverai_backend.dto.AuthRequest;
import com.deliverai.deliverai_backend.dto.AuthResponse;
import com.deliverai.deliverai_backend.dto.RegisterRequest;

import com.deliverai.deliverai_backend.entity.User;

import com.deliverai.deliverai_backend.repository.UserRepository;

import com.deliverai.deliverai_backend.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
//@CrossOrigin("*")


public class AuthController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {

        boolean exists =
                userRepository.existsByEmail(
                        request.getEmail()
                );

        if (exists) {

            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");
        }

        User user = new User();

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole("USER");

        userRepository.save(user);

        return ResponseEntity.ok(
                "User Registered Successfully"
        );
    }
    @GetMapping("/test")
    public String test() {
        return "Backend Working";
    }

    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        // USER NOT FOUND

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        // PASSWORD CHECK

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!matches) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid Password");
        }

        // GENERATE JWT TOKEN

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return ResponseEntity.ok(
                new AuthResponse(token)
        );
    }
}