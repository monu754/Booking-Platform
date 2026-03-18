package com.showbooking.backend.controller;

import com.showbooking.backend.dto.show.CreateShowRequest;
import com.showbooking.backend.dto.show.ShowResponse;
import com.showbooking.backend.service.ShowService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @GetMapping
    public List<ShowResponse> getShows() {
        return showService.getShows();
    }

    @GetMapping("/{id}")
    public ShowResponse getShowById(@PathVariable("id") Long id) {
        return showService.getShowById(id);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @ResponseStatus(HttpStatus.CREATED)
    public ShowResponse createShow(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("duration") Integer duration,
            @RequestParam("language") String language,
            @RequestParam("genre") String genre,
            @RequestParam(value = "posterUrl", required = false) String posterUrl,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        
        CreateShowRequest request = new CreateShowRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setDuration(duration);
        request.setLanguage(language);
        request.setGenre(genre);
        request.setPosterUrl(posterUrl);
        
        return showService.createShow(request, image);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ShowResponse updateShow(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("duration") Integer duration,
            @RequestParam("language") String language,
            @RequestParam("genre") String genre,
            @RequestParam(value = "posterUrl", required = false) String posterUrl,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        
        CreateShowRequest request = new CreateShowRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setDuration(duration);
        request.setLanguage(language);
        request.setGenre(genre);
        request.setPosterUrl(posterUrl);
        
        return showService.updateShow(id, request, image);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShow(@PathVariable("id") Long id) {
        showService.deleteShow(id);
    }
}
