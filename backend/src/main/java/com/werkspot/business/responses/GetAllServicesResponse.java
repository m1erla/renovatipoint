package com.werkspot.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllServicesResponse {
    private int id;
    private String name;
    private String jobTitleName;
    private int categoryId;
    private String categoryName;
    private boolean isActive;

}
