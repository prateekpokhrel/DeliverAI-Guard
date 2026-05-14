package com.deliverai.deliverai_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "live_tracking")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class LiveTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trackingId;

    private Long deliveryId;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private String currentStatus;

    private LocalDateTime updatedAt;
}