package com.werkspot.business.responses;

import com.werkspot.entities.concretes.Ads;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllByIdMastersResponse {
    private int id;
    private String name;
    private String surname;
    private String phoneNumber;
    private String postCode;
    private String jobTitleName;


}
