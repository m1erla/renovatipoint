package com.renovatipoint.business.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateAdsRequest {
    private int id;
    private String name;
    private String descriptions;
    private boolean isActive;
}
