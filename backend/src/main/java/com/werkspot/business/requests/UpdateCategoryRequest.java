package com.werkspot.business.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateCategoryRequest {
    private int id;
    private String name;
    private boolean isActive;
}
