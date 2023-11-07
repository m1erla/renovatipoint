package com.werkspot.business.responses;

import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllJobTitlesResponse {
    private int id;
    private String name;
    private String descriptions;
    private String categoryName;
    private int categoryId;


    public GetAllJobTitlesResponse(JobTitle entity, List<GetAllCategoriesResponse> categories){
        this.id = entity.getId();
        this.name = entity.getName();
        this.descriptions = entity.getDescriptions();
        this.categoryName = entity.getCategory().getName();
        this.categoryId = entity.getCategory().getId();
    }
}
