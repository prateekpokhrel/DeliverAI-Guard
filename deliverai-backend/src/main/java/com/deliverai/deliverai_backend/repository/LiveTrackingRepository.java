package com.deliverai.deliverai_backend.repository;

import com.deliverai.deliverai_backend.entity.LiveTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiveTrackingRepository
        extends JpaRepository<LiveTracking, Long> {
}