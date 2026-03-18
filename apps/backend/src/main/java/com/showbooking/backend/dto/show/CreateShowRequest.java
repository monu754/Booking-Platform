package com.showbooking.backend.dto.show;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateShowRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @Min(1)
    private Integer duration;

    @NotBlank
    private String language;

    @NotBlank
    private String genre;

    private String posterUrl;
}
