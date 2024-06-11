package com.renovatipoint.business.responses;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GetUsersResponse {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String image;
    private String postCode;
    private String jobTitleName;
    private String role;
    private List<GetAllAdsResponse> ads;
}
