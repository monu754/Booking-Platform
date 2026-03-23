package com.showbooking.backend.repository;

import com.showbooking.backend.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByShowTiming_Id(Long showTimingId);
    
    @Query("SELECT bs FROM BookingSeat bs JOIN FETCH bs.booking b WHERE bs.showTiming.id = :showTimingId AND b.status NOT IN :excludedStatuses")
    List<BookingSeat> findActiveBookingsByShowTiming(@Param("showTimingId") Long showTimingId, @Param("excludedStatuses") List<com.showbooking.backend.entity.BookingStatus> excludedStatuses);
    
    List<BookingSeat> findByBooking_Id(Long bookingId);
    boolean existsByShowTiming_IdAndSeat_Id(Long showTimingId, Long seatId);
    boolean existsByShowTiming_Show_Id(Long showId);
}
