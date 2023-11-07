package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.CategoryService;
import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.requests.UpdateJobTitleRequest;
import com.werkspot.business.responses.GetAllCategoriesResponse;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import com.werkspot.business.rules.JobTitleBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.CategoryRepository;
import com.werkspot.dataAccess.abstracts.JobTitleRepository;
import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Lazy
public class JobTitleManager implements JobTitleService {
    public ModelMapperService modelMapperService;
    private JobTitleRepository jobTitleRepository;
    private JobTitleBusinessRules jobTitleBusinessRules;
    private CategoryRepository categoryRepository;
    private CategoryService categoryService;
    @Override
    public List<GetAllJobTitlesResponse> getAllJobTitlesResponseList() {
        List<JobTitle> jobTitles = jobTitleRepository.findAll();

        List<GetAllJobTitlesResponse> jobTitlesResponses =
                jobTitles.stream().map(jobTitle -> this.modelMapperService.forResponse().map(jobTitle, GetAllJobTitlesResponse.class)).collect(Collectors.toList());

            return jobTitlesResponses;




    }

    @Override
    public List<GetAllJobTitlesResponse> getAllOrByCategoryId(Optional<Integer> categoryId) {
        if(categoryId.isPresent()){
            List<JobTitle> jotTitlesByCategory = jobTitleRepository.findAllByJobTitles_Id(categoryId.get());


            return jotTitlesByCategory.stream()
                    .map(jobTitle -> modelMapperService.forResponse().map(jobTitle, GetAllJobTitlesResponse.class))
                    .collect(Collectors.toList());

        }else {
            return getAllJobTitlesResponseList();
        }

    }

    @Override
    public void add(CreateJobTitleRequest createJobTitleRequest) {
        this.jobTitleBusinessRules.checkIfJobTitleNameExists(createJobTitleRequest.getName());
         JobTitle jobTitle = this.modelMapperService.forRequest()
                 .map(createJobTitleRequest, JobTitle.class);
         this.jobTitleRepository.save(jobTitle);
    }

    @Override
    public void update(UpdateJobTitleRequest updateJobTitleRequest) {
          JobTitle jobTitle = this.modelMapperService.forRequest()
                  .map(updateJobTitleRequest, JobTitle.class);
          this.jobTitleRepository.save(jobTitle);
    }

    @Override
    public void delete(int id) {
        this.jobTitleRepository.deleteById(id);
    }
    @Override
    public void addJobTitleToCategory(CreateJobTitleRequest createJobTitleRequest, String categoryName){
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> {
                    Category newCategory = Category.builder()
                            .name(categoryName)
                            .isActive(true)
                            .build();
                    return categoryRepository.save(newCategory);
                });


        JobTitle jobTitle = modelMapperService.forRequest().map(createJobTitleRequest, JobTitle.class);

        category.addJobTitle(jobTitle);

        categoryRepository.save(category);
    }
}
