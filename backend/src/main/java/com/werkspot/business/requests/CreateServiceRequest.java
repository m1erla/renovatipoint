package com.werkspot.business.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateServiceRequest {
    private String name;
    private int jobTitleId;
    private int categoryId;
    private boolean isActive;
}
