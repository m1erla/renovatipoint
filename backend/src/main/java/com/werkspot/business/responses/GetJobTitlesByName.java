package com.werkspot.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetJobTitlesByName {
    private int id;
    private String jobTitleName;
    private String descriptions;
    private String serviceName;
}
