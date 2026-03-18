package com.showbooking.backend.service;

import com.showbooking.backend.dto.show.CreateShowRequest;
import com.showbooking.backend.dto.show.ShowResponse;
import com.showbooking.backend.dto.show.ShowTimingResponse;
import com.showbooking.backend.entity.Show;
import com.showbooking.backend.entity.ShowTiming;
import com.showbooking.backend.repository.ShowRepository;
import com.showbooking.backend.repository.ShowTimingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final ShowTimingRepository showTimingRepository;
    private final FileStorageService fileStorageService;

    public ShowService(ShowRepository showRepository, ShowTimingRepository showTimingRepository, FileStorageService fileStorageService) {
        this.showRepository = showRepository;
        this.showTimingRepository = showTimingRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<ShowResponse> getShows() {
        return showRepository.findAll().stream()
            .map(this::mapToShowResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ShowResponse getShowById(Long id) {
        return mapToShowResponse(showRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Show not found: " + id)));
    }

    public ShowResponse createShow(CreateShowRequest request, org.springframework.web.multipart.MultipartFile image) {
        Show show = new Show();
        show.setTitle(request.getTitle());
        show.setDescription(request.getDescription());
        show.setDuration(request.getDuration());
        show.setLanguage(request.getLanguage());
        show.setGenre(request.getGenre());
        
        if (image != null && !image.isEmpty()) {
            show.setPosterUrl(fileStorageService.save(image));
        } else {
            show.setPosterUrl(request.getPosterUrl());
        }
        
        return mapToShowResponse(showRepository.save(show));
    }

    @Transactional
    public ShowResponse updateShow(Long id, CreateShowRequest request, org.springframework.web.multipart.MultipartFile image) {
        Show show = showRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Show not found"));

        show.setTitle(request.getTitle());
        show.setDescription(request.getDescription());
        show.setDuration(request.getDuration());
        show.setLanguage(request.getLanguage());
        show.setGenre(request.getGenre());
        
        if (image != null && !image.isEmpty()) {
            show.setPosterUrl(fileStorageService.save(image));
        } else {
            show.setPosterUrl(request.getPosterUrl());
        }

        return mapToShowResponse(showRepository.save(show));
    }

    @Transactional
    public void deleteShow(Long id) {
        if (!showRepository.existsById(id)) {
            throw new EntityNotFoundException("Show not found");
        }
        showRepository.deleteById(id);
    }

    private ShowResponse mapToShowResponse(Show show) {
        List<ShowTimingResponse> timings = showTimingRepository.findByShow_Id(show.getId()).stream()
            .map(this::mapTimingToResponse)
            .toList();

        return new ShowResponse(
            show.getId(),
            show.getTitle(),
            show.getDescription(),
            show.getDuration(),
            show.getLanguage(),
            show.getGenre(),
            show.getPosterUrl(),
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
}
