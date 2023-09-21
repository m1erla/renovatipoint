package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMasterRequest {
    private String name;
    private String surname;
    private String experience;
    private String jobTitles;
    private String services;
    private String email;
    private String phoneNumber;
    private String postCode;
    private String descriptions;

}
