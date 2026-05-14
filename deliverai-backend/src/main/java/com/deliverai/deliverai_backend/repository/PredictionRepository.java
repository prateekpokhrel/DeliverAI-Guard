package com.deliverai.deliverai_backend.repository;

import com.deliverai.deliverai_backend.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository
        extends JpaRepository<Prediction, Long> {
}