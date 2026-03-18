package com.showbooking.backend.repository;

import com.showbooking.backend.entity.ShowTiming;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowTimingRepository extends JpaRepository<ShowTiming, Long> {
    List<ShowTiming> findByShow_Id(Long showId);
}
