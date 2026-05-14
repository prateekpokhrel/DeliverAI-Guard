package com.deliverai.deliverai_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historic_data")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class HistoricData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    private Long deliveryId;

    private String actualStatus;

    private Integer actualDeliveryTime;

    private Integer delayMinutes;

    private String delayReason;

    private LocalDateTime recordedAt;
}