package com.deliverai.deliverai_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.deliverai.deliverai_backend.dto.PredictionRequest;
import com.deliverai.deliverai_backend.dto.PredictionResponse;
import com.deliverai.deliverai_backend.entity.Delivery;
import com.deliverai.deliverai_backend.repository.DeliveryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIService {

    private final DeliveryRepository deliveryRepository;

    // FIX 1: Declared the messaging template so it can be injected by Lombok
    private final SimpMessagingTemplate messagingTemplate;

    // Read AI service URL from configuration (allows Railway / production override)
    @Value("${ai.service.url:http://ai-service:8000/predict}")
    private String FASTAPI_URL;

    public PredictionResponse predictRisk(PredictionRequest request) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<PredictionRequest> entity = new HttpEntity<>(request, headers);

            // CALL FASTAPI
            ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                    FASTAPI_URL,
                    HttpMethod.POST,
                    entity,
                    PredictionResponse.class
            );

            PredictionResponse prediction = response.getBody();

            if (prediction == null) {
                throw new RuntimeException("Prediction response is NULL");
            }

            // CREATE DELIVERY ENTITY & SET INPUT DATA
            Delivery delivery = new Delivery();
            delivery.setAgentAge(request.getAgentAge());
            delivery.setAgentRating(request.getAgentRating());
            delivery.setWeather(request.getWeather());
            delivery.setTraffic(request.getTraffic());
            delivery.setVehicle(request.getVehicle());
            delivery.setArea(request.getArea());
            delivery.setCategory(request.getCategory());
            delivery.setDistanceKm(request.getDistanceKm());
            delivery.setPickupDelayMinutes(request.getPickupDelayMinutes());
            delivery.setRushHour(request.getRushHour());
            delivery.setOrderHour(request.getOrderHour());

            // SET AI PREDICTION RESULT
            delivery.setPredictedRisk(prediction.getPredictedDeliveryRisk());

            // SAVE TO DATABASE
            Delivery savedDelivery = deliveryRepository.save(delivery);

            // WEBSOCKET LIVE UPDATE
            messagingTemplate.convertAndSend("/topic/deliveries", savedDelivery);

            // FIX 2: Moved logging BEFORE the return statement so it actually executes
            System.out.println("=====================================");
            System.out.println("DATA SAVED SUCCESSFULLY");
            System.out.println("DATABASE ID : " + savedDelivery.getId());
            System.out.println("PREDICTED RISK : " + savedDelivery.getPredictedRisk());
            System.out.println("=====================================");

            // RETURN RESPONSE TO FRONTEND
            return prediction;

        } catch (Exception e) {
            System.out.println("=====================================");
            System.out.println("AI SERVICE ERROR");
            e.printStackTrace();
            System.out.println("=====================================");

            PredictionResponse errorResponse = new PredictionResponse();
            errorResponse.setPredictedDeliveryRisk("ERROR");
            return errorResponse;
        }
    }
}