package com.werkspot.business.responses;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetUsersResponse {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String postCode;
    private String jobTitleName;
    private String role;


}
