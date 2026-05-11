package com.deliverai.deliverai_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonitoringResponse {

    private Integer activeDeliveries;

    private Integer highRiskDeliveries;

    private Double aiAccuracy;

    private Double preventionSuccess;
}