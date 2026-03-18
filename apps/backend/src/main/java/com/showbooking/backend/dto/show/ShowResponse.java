package com.showbooking.backend.dto.show;

import java.util.List;

public record ShowResponse(
    Long id,
    String title,
    String description,
    Integer duration,
    String language,
    String genre,
    String posterUrl,
    List<ShowTimingResponse> timings
) {
}
