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
    private int experience;
    private String jobTitleName;
    private String serviceName;
    private String email;
    private String phoneNumber;
    private String postCode;
    private String descriptions;

}
