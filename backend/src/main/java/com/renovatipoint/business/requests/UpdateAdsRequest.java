package com.renovatipoint.business.requests;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateAdsRequest {
    private int id;
    private String name;
    private boolean isActive;
    private String descriptions;
    private List<MultipartFile> storages;
    private String adReleaseDate;
    private int categoryId;
    private int serviceId;
}
