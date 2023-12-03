package com.werkspot.business.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateCategoryRequest {
    private String name;
    private boolean isActive;
}
