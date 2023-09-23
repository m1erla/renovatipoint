package com.werkspot.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllAdsResponse {
    private int id;
    private String adName;
    private String descriptions;
    private Date adReleaseDate;

}
