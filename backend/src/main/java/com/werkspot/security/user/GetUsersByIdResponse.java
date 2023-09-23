package com.werkspot.security.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUsersByIdResponse {
    private Integer id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String jobTitleName;
    private String postCode;
}
