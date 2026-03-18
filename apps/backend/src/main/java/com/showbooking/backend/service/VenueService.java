package com.showbooking.backend.service;

import com.showbooking.backend.dto.venue.CreateVenueRequest;
import com.showbooking.backend.dto.venue.VenueSummaryResponse;
import com.showbooking.backend.entity.Venue;
import com.showbooking.backend.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Transactional(readOnly = true)
    public List<VenueSummaryResponse> getAllVenues() {
        return venueRepository.findAll().stream()
            .map(this::mapVenue)
            .toList();
    }

    @Transactional
    public VenueSummaryResponse createVenue(CreateVenueRequest request) {
        Venue venue = new Venue();
        venue.setName(request.getName().trim());
        venue.setCity(request.getCity().trim());
        venue.setAddress(request.getAddress().trim());
        return mapVenue(venueRepository.save(venue));
    }

    public VenueSummaryResponse mapVenue(Venue venue) {
        return new VenueSummaryResponse(
            venue.getId(),
            venue.getName(),
            venue.getCity(),
            venue.getAddress()
        );
    }
}
