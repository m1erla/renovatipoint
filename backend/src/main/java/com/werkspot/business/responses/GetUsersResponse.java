package com.werkspot.business.responses;

import com.werkspot.entities.concretes.Ads;
import lombok.*;

import java.util.List;

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
    private List<GetAllAdsResponse> ads;


}
