package com.renovatipoint.business.requests;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateAdsRequest {
    private int userId;
    private String name;
    private boolean isActive;
    private String descriptions;
    private List<MultipartFile> images;
    private String adReleaseDate;
    private int categoryId;
    private int serviceId;
}
