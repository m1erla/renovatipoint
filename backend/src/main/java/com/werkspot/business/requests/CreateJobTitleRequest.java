package com.werkspot.business.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateJobTitleRequest {
    private String name;
    private String descriptions;
    private int categoryId;
}
