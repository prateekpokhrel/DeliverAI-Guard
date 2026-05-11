package com.deliverai.deliverai_backend.controller;

import com.deliverai.deliverai_backend.service.RecommendationService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public List<String> getRecommendations() {

        return recommendationService
                .getSmartRecommendations();
    }
}