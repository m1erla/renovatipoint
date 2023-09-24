package com.werkspot.business.responses;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.Employment;
import com.werkspot.entities.concretes.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllAdsResponse {
    private int id;
    private String adName;
    private String descriptions;
    private String adReleaseDate;
    private Category categoryId;
    private Employment serviceId;
    private User userId;

}
