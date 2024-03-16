package com.werkspot.business.requests;

import lombok.*;

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
    private String adReleaseDate;
    private int categoryId;
    private int serviceId;
}
