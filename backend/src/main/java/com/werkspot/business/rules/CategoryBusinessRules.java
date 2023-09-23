package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CategoryBusinessRules {

    private CategoryRepository categoryRepository;

    public void checkIfCategoryExists(String category){
        if (categoryRepository.existsByCategoryName(category)){
            throw new BusinessException("This category name is already exists! Please try different name");
        }
    }
}
