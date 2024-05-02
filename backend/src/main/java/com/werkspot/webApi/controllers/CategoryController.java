package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.CategoryService;
import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateCategoryRequest;
import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.requests.UpdateCategoryRequest;
import com.werkspot.business.responses.GetAllCategoriesResponse;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/categories")
@AllArgsConstructor
public class CategoryController {
    private CategoryService categoryService;

    @GetMapping
    public List<GetAllCategoriesResponse> getAllCategories(){
        return categoryService.getAll();
    }

    @GetMapping("/{categoryName}/jobTitles")
    public List<GetAllJobTitlesResponse> getJobTitlesByCategory(@PathVariable String categoryName){
        return categoryService.getJobTitlesByCategory(categoryName);
    }


    @PostMapping("/category")
    @ResponseStatus(code = HttpStatus.CREATED)
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
