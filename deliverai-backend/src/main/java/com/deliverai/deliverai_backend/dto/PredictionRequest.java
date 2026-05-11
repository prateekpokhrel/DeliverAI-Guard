package com.deliverai.deliverai_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PredictionRequest {

    @JsonProperty("Agent_Age")
    private Integer agentAge;

    @JsonProperty("Agent_Rating")
    private Double agentRating;

    @JsonProperty("Weather")
    private String weather;

    @JsonProperty("Traffic")
    private String traffic;

    @JsonProperty("Vehicle")
    private String vehicle;

    @JsonProperty("Area")
    private String area;

    @JsonProperty("Category")
    private String category;

    @JsonProperty("Distance_km")
    private Double distanceKm;

    @JsonProperty("Pickup_Delay_Minutes")
    private Integer pickupDelayMinutes;

    @JsonProperty("Rush_Hour")
    private Integer rushHour;

    @JsonProperty("Order_Hour")
    private Integer orderHour;
}