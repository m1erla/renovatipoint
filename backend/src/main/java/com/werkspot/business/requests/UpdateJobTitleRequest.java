package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateJobTitleRequest {
    private int id;
    private String name;
    private String descriptions;
    private String categoryName;
    private int categoryId;
}
