package com.werkspot.business.responses;

import lombok.Data;

@Data
public class GetUsersResponse {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String postCode;
    private String jobTitleName;
    private String role;

    public GetUsersResponse() {
    }

    public GetUsersResponse(int id, String name, String surname, String email, String phoneNumber, String postCode, String jobTitleName, String role) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.postCode = postCode;
        this.jobTitleName = jobTitleName;
        this.role = role;
    }
}
