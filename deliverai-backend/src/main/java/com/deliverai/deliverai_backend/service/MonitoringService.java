package com.deliverai.deliverai_backend.service;

import com.deliverai.deliverai_backend.dto.MonitoringResponse;

import org.springframework.stereotype.Service;

@Service
public class MonitoringService {

    public MonitoringResponse getDashboardStats() {

        return new MonitoringResponse(
                12845,
                326,
                96.2,
                94.0
        );
    }
}