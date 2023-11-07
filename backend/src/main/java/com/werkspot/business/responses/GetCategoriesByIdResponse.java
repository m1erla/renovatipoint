package com.werkspot.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCategoriesByIdResponse {
    private int id;
    private String name;
    private String jobTitleName;
    private boolean isActive;
}
