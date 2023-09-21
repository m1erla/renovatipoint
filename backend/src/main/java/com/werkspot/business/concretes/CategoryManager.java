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
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryManager implements CategoryService {

    private ModelMapperService modelMapperService;
    private CategoryRepository categoryRepository;
    private CategoryBusinessRules categoryBusinessRules;


    @Override
    public List<GetAllCategoriesResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();


        return null;
    }

    @Override
    public GetCategoriesByIdResponse getById(int id) {
        return null;
    }

    @Override
    public void add(CreateCategoryRequest createCategoryRequest) {

    }

    @Override
    public void update(UpdateCategoryRequest updateCategoryRequest) {

    }

    @Override
    public void delete(int id) {

    }
}
