package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.CategoryService;
import com.werkspot.business.requests.CreateCategoryRequest;
import com.werkspot.business.requests.UpdateCategoryRequest;
import com.werkspot.business.responses.GetAllCategoriesResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@AllArgsConstructor
public class CategoryController {
    private CategoryService categoryService;

    @GetMapping
    public List<GetAllCategoriesResponse> getAllCategories(){
        return categoryService.getAll();
    }


    @PostMapping("/category")
    public void addCategory(@RequestBody CreateCategoryRequest createCategoryRequest){
        this.categoryService.add(createCategoryRequest);
    }


    @PutMapping("/category_update/{id}")
    public void updateCategory(@RequestBody UpdateCategoryRequest updateCategoryRequest){
        this.categoryService.update(updateCategoryRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable int id){
        this.categoryService.delete(id);
    }
}
