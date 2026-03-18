package com.showbooking.backend.repository;

import com.showbooking.backend.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepository extends JpaRepository<Show, Long> {
}
