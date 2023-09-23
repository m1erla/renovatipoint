package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateAdsRequest {
    private int id;
    private String adName;
    private String descriptions;
    private boolean isActive;
}
