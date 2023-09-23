package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAdsRequest {

    private String adName;
    private boolean isActive;
    private String descriptions;
    private Date adReleaseDate;

}
