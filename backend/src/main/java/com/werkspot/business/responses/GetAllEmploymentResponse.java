package com.werkspot.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllEmploymentResponse {
    private int id;
    private String jobTitleName;
    private String serviceName;

}
