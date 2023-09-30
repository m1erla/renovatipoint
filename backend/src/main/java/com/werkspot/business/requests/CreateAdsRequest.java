package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAdsRequest {
    private int userId;
    private String name;
    private boolean isActive;
    private String descriptions;
    private String adReleaseDate;
    private int categoryId;
    private int serviceId;
}
