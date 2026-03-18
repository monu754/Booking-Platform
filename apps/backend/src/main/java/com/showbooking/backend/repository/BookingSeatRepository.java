package com.showbooking.backend.repository;

import com.showbooking.backend.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByShowTiming_Id(Long showTimingId);
    List<BookingSeat> findByBooking_Id(Long bookingId);
    boolean existsByShowTiming_IdAndSeat_Id(Long showTimingId, Long seatId);
}
