package com.showbooking.backend.service;

import com.showbooking.backend.dto.show.CreateShowRequest;
import com.showbooking.backend.dto.show.ShowResponse;
import com.showbooking.backend.dto.show.ShowTimingResponse;
import com.showbooking.backend.dto.venue.VenueSummaryResponse;
import com.showbooking.backend.entity.AppRole;
import com.showbooking.backend.entity.Show;
import com.showbooking.backend.entity.ShowTiming;
import com.showbooking.backend.entity.User;
import com.showbooking.backend.entity.Venue;
import com.showbooking.backend.repository.ShowRepository;
import com.showbooking.backend.repository.ShowTimingRepository;
import com.showbooking.backend.repository.UserRepository;
import com.showbooking.backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final ShowTimingRepository showTimingRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ShowService(
        ShowRepository showRepository,
        ShowTimingRepository showTimingRepository,
        VenueRepository venueRepository,
        UserRepository userRepository,
        FileStorageService fileStorageService
    ) {
        this.showRepository = showRepository;
        this.showTimingRepository = showTimingRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<ShowResponse> getShows() {
        return showRepository.findAll().stream()
            .map(this::mapToShowResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ShowResponse> getManagedShows(Long userId) {
        User user = getUser(userId);
        List<Show> shows;
        if (hasRole(user, AppRole.ADMIN)) {
            shows = showRepository.findAll();
        } else {
            Set<Long> accessibleVenueIds = getAccessibleVenueIds(user);
            shows = showRepository.findDistinctByVenues_IdIn(accessibleVenueIds).stream()
                .filter(show -> show.getVenues().stream().allMatch(venue -> accessibleVenueIds.contains(venue.getId())))
                .toList();
        }

        return shows.stream()
            .map(this::mapToShowResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ShowResponse getShowById(Long id) {
        return mapToShowResponse(showRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Show not found: " + id)));
    }

    @Transactional
    public ShowResponse createShow(Long userId, CreateShowRequest request, MultipartFile image) {
        User user = getUser(userId);
        Set<Venue> selectedVenues = resolveAndValidateVenues(user, request.getVenueIds());

        Show show = new Show();
        applyShowUpdates(show, request, image, selectedVenues);
        return mapToShowResponse(showRepository.save(show));
    }

    @Transactional
    public ShowResponse updateShow(Long userId, Long id, CreateShowRequest request, MultipartFile image) {
        User user = getUser(userId);
        Show show = showRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Show not found"));

        ensureCanManageShow(user, show);
        Set<Venue> selectedVenues = resolveAndValidateVenues(user, request.getVenueIds());
        applyShowUpdates(show, request, image, selectedVenues);

        return mapToShowResponse(showRepository.save(show));
    }

    @Transactional
    public void deleteShow(Long userId, Long id) {
        User user = getUser(userId);
        Show show = showRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Show not found"));

        ensureCanManageShow(user, show);
        showRepository.delete(show);
    }

    private void applyShowUpdates(Show show, CreateShowRequest request, MultipartFile image, Set<Venue> venues) {
        show.setTitle(request.getTitle());
        show.setDescription(request.getDescription());
        show.setDuration(request.getDuration());
        show.setLanguage(request.getLanguage());
        show.setGenre(request.getGenre());
        show.setVenues(venues);

        if (image != null && !image.isEmpty()) {
            show.setPosterUrl(fileStorageService.save(image));
        } else {
            show.setPosterUrl(request.getPosterUrl());
        }
    }

    private Set<Venue> resolveAndValidateVenues(User user, List<Long> venueIds) {
        Set<Venue> selectedVenues = venueIds.stream()
            .map(venueId -> venueRepository.findById(venueId)
                .orElseThrow(() -> new EntityNotFoundException("Venue not found: " + venueId)))
            .collect(Collectors.toSet());

        if (selectedVenues.isEmpty()) {
            throw new IllegalArgumentException("At least one venue must be selected");
        }

        if (hasRole(user, AppRole.ORGANIZER) && !hasRole(user, AppRole.ADMIN)) {
            Set<Long> accessibleVenueIds = getAccessibleVenueIds(user);
            boolean allowed = selectedVenues.stream().allMatch(venue -> accessibleVenueIds.contains(venue.getId()));
            if (!allowed) {
                throw new IllegalArgumentException("You can only manage shows for your assigned venues");
            }
        }

        return selectedVenues;
    }

    private void ensureCanManageShow(User user, Show show) {
        if (hasRole(user, AppRole.ADMIN)) {
            return;
        }

        Set<Long> accessibleVenueIds = getAccessibleVenueIds(user);
        boolean hasAccess = show.getVenues().stream().allMatch(venue -> accessibleVenueIds.contains(venue.getId()));
        if (!hasAccess) {
            throw new IllegalArgumentException("You can only manage shows for your assigned venues");
        }
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
    }

    private boolean hasRole(User user, AppRole role) {
        return user.getRoles().stream().anyMatch(userRole -> userRole.getName() == role);
    }

    private Set<Long> getAccessibleVenueIds(User user) {
        return user.getVenues().stream()
            .map(Venue::getId)
            .collect(Collectors.toSet());
    }

    private ShowResponse mapToShowResponse(Show show) {
        List<ShowTimingResponse> timings = showTimingRepository.findByShow_Id(show.getId()).stream()
            .map(this::mapTimingToResponse)
            .toList();
        List<VenueSummaryResponse> venues = show.getVenues().stream()
            .map(this::mapVenueToResponse)
            .toList();

        return new ShowResponse(
            show.getId(),
            show.getTitle(),
            show.getDescription(),
            show.getDuration(),
            show.getLanguage(),
            show.getGenre(),
            show.getPosterUrl(),
            venues.stream().map(VenueSummaryResponse::id).toList(),
            venues,
            timings
        );
    }

    private ShowTimingResponse mapTimingToResponse(ShowTiming timing) {
        return new ShowTimingResponse(
            timing.getId(),
            timing.getScreen().getName(),
            timing.getScreen().getVenue().getName(),
            timing.getScreen().getVenue().getCity(),
            timing.getStartTime(),
            timing.getPrice()
        );
    }

    private VenueSummaryResponse mapVenueToResponse(Venue venue) {
        return new VenueSummaryResponse(
            venue.getId(),
            venue.getName(),
            venue.getCity(),
            venue.getAddress()
        );
    }
}
