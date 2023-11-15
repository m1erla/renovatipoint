package com.werkspot.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUsersByIdResponse {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String jobTitleName;
    private String postCode;
}
