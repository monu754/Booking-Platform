package com.showbooking.backend.repository;

import com.showbooking.backend.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findDistinctByVenues_IdIn(Collection<Long> venueIds);
    boolean existsByIdAndVenues_IdIn(Long id, Collection<Long> venueIds);
}
