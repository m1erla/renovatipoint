package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateServiceRequest {
    private int id;
    private String serviceName;
    private String categoryName;
    private String jobTitleName;
}
