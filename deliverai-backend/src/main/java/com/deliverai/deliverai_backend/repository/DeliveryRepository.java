package com.deliverai.deliverai_backend.repository;

import com.deliverai.deliverai_backend.entity.Delivery;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository
        extends JpaRepository<Delivery, Long> {

    List<Delivery>
    findAllByOrderByIdDesc();
}