package com.deliverai.deliverai_backend.controller;

import com.deliverai.deliverai_backend.dto.PredictionRequest;
import com.deliverai.deliverai_backend.dto.PredictionResponse;

import com.deliverai.deliverai_backend.service.AIService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final AIService aiService;

    @PostMapping("/predict")
    public PredictionResponse predict(
            @RequestBody PredictionRequest request
    ) {

        return aiService.predictRisk(request);
    }
}