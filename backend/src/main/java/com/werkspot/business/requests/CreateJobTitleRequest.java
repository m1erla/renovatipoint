package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateJobTitleRequest {
    private String jobTitleName;
    private String descriptions;
    private String serviceName;
}
