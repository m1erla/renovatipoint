package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEmploymentRequest {
    private String jobTitleName;
    private String serviceName;
    private boolean isActive;
}
