package com.renovatipoint.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUsersByIdResponse {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String image;
    private String postCode;
    private String jobTitleName;
    private String role;

}
