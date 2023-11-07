package com.werkspot.business.responses;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllCategoriesResponse {
    private int id;
    private String name;
    private String jobTitles;
    private boolean isActive;



}
