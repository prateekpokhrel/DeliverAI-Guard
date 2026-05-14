package com.deliverai.deliverai_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long predictionId;

    private Long deliveryId;

    private String riskLevel;

    private Double riskScore;

    private String aiModelVersion;

    private LocalDateTime predictedAt;
}