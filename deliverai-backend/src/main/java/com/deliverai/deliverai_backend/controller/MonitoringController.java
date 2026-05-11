package com.deliverai.deliverai_backend.controller;

import com.deliverai.deliverai_backend.entity.Delivery;

import com.deliverai.deliverai_backend.repository.DeliveryRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MonitoringController {

    private final DeliveryRepository deliveryRepository;

    @GetMapping("/all")
    public List<Delivery> getAllDeliveries() {

        return deliveryRepository.findAllByOrderByIdDesc();
    }
}