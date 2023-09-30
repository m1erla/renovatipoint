package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateServiceRequest {
    private String name;
    private int jobTitleId;
    private int categoryId;
    private int adId;
    private boolean isActive;
}
