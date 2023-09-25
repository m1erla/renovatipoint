package com.werkspot.business.requests;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.Employment;
import com.werkspot.entities.concretes.Master;
import com.werkspot.entities.concretes.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAdsRequest {

    private String adName;
    private boolean isActive;
    private String descriptions;
    private String adReleaseDate;
    private int categoryId;
    private int serviceId;
    private int userId;

}
