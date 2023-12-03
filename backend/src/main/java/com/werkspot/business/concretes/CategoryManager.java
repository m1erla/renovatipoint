package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.CategoryService;
import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateCategoryRequest;
import com.werkspot.business.requests.UpdateCategoryRequest;
import com.werkspot.business.responses.GetAllCategoriesResponse;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import com.werkspot.business.responses.GetCategoriesByIdResponse;
import com.werkspot.business.rules.CategoryBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.CategoryRepository;
import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Lazy
public class CategoryManager implements CategoryService {

    private final ModelMapperService modelMapperService;
    private final CategoryRepository categoryRepository;
    private final CategoryBusinessRules categoryBusinessRules;

    public CategoryManager(ModelMapperService modelMapperService, CategoryRepository categoryRepository, CategoryBusinessRules categoryBusinessRules) {
        this.modelMapperService = modelMapperService;
        this.categoryRepository = categoryRepository;
        this.categoryBusinessRules = categoryBusinessRules;
    }

    @Override
    public List<GetAllCategoriesResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();

        List<GetAllCategoriesResponse> categoriesResponses =
                categories.stream().map(category ->
                        this.modelMapperService.forResponse().map(category, GetAllCategoriesResponse.class)).collect(Collectors.toList());

        return categoriesResponses;

    }

    @Override
    public GetCategoriesByIdResponse getById(int id) {
        Category category = this.categoryRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);


              return this.modelMapperService.forResponse().map(category, GetCategoriesByIdResponse.class);

    }


    @Override
    public void add(CreateCategoryRequest createCategoryRequest) {
        this.categoryBusinessRules.checkIfCategoryExists(createCategoryRequest.getName());

        Category category = this.modelMapperService.forRequest().map(createCategoryRequest, Category.class);
        this.categoryRepository.save(category);
    }

    @Override
    public void update(UpdateCategoryRequest updateCategoryRequest) {
        Category category = this.modelMapperService.forRequest().map(updateCategoryRequest, Category.class);
        this.categoryRepository.save(category);

    }

    @Override
    public void delete(int id) {
        this.categoryRepository.deleteById(id);

    }

    @Override
    public List<GetAllJobTitlesResponse> getJobTitlesByCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName).orElseThrow(() -> new EntityNotFoundException("Category not found!"));
        List<JobTitle> jobTitles = category.getJobTitles();

        return jobTitles.stream()
                .map(jobTitle -> modelMapperService.forResponse().map(jobTitle, GetAllJobTitlesResponse.class))
                .collect(Collectors.toList());


    }
}
