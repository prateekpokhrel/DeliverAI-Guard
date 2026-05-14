package com.deliverai.deliverai_backend.repository;

import com.deliverai.deliverai_backend.entity.HistoricData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricDataRepository
        extends JpaRepository<HistoricData, Long> {
}