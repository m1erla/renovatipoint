package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.CategoryService;
import com.werkspot.business.requests.CreateCategoryRequest;
import com.werkspot.business.requests.UpdateCategoryRequest;
import com.werkspot.business.responses.GetAllCategoriesResponse;
import com.werkspot.business.responses.GetCategoriesByIdResponse;
import com.werkspot.business.rules.CategoryBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.CategoryRepository;
import com.werkspot.entities.concretes.Category;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryManager implements CategoryService {

    private ModelMapperService modelMapperService;
    private CategoryRepository categoryRepository;
    private CategoryBusinessRules categoryBusinessRules;


    @Override
    public List<GetAllCategoriesResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();

//        List<GetAllCategoriesResponse> categoriesResponses =
//                categories.stream().map(category -> this.modelMapperService.forResponse().map(category, GetAllCategoriesResponse.class)).collect(Collectors.toList());

        return categories.stream()
                .map(category -> modelMapperService.forResponse().map(category, GetAllCategoriesResponse.class))
                .collect(Collectors.toList());
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
}
