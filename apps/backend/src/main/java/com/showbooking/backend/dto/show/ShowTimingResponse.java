package com.showbooking.backend.dto.show;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ShowTimingResponse(
    Long id,
    String screenName,
    String venueName,
    String venueCity,
    LocalDateTime startTime,
    BigDecimal price
) {
}
