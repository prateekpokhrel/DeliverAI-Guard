package com.deliverai.deliverai_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

import java.util.List;

@Data
public class PredictionResponse {

    @JsonProperty("Predicted_Delivery_Risk")
    private String predictedDeliveryRisk;

    @JsonProperty("Recommendations")
    private List<String> recommendations;

    @JsonProperty("Main_Causes")
    private List<String> mainCauses;
}