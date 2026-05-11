package com.deliverai.deliverai_backend.entity;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    private Integer agentAge;

    private Double agentRating;

    private String weather;

    private String traffic;

    private String vehicle;
    @JsonProperty("predictedRisk")
    private String predictedRisk;

    @JsonProperty("distanceKm")
    private Double distanceKm;

    @JsonProperty("pickupDelayMinutes")
    private Integer pickupDelayMinutes;
    private String area;

    private String category;




    private Integer rushHour;

    private Integer orderHour;


}