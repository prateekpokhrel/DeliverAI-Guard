package com.deliverai.deliverai_backend.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    public List<String> getSmartRecommendations() {

        return List.of(
                "Avoid rush-hour delivery window",
                "Use alternate delivery route",
                "Assign nearest available delivery agent",
                "Enable proactive customer communication",
                "Prioritize warehouse dispatch"
        );
    }
}