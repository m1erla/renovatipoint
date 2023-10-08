package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.*;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
@CrossOrigin("*")
public class UserController {
    private UserService userService;
    private MasterService masterService;
    private AdsService adsService;
    private IService iService;
    private CategoryService categoryService;
    private JobTitleService jobTitleService;

    @GetMapping
    public List<GetAllUsersResponse> getAllUsers(){
        return userService.getAll();
    }
    @GetMapping("/{id}")
    public GetUsersByIdResponse getUsersById(@PathVariable int id){
        return userService.getById(id);
    }

    @GetMapping("/masters/{id}")
    public GetAllByIdMastersResponse getMasterById(@PathVariable int id){
        return masterService.getById(id);
    }

    @GetMapping("/masters")
    public List<GetAllMastersResponse> getAllMasters(){
        return masterService.getAll();
    }

    @GetMapping("/ads")
    public List<GetAllAdsResponse> getAllAds(){
        return adsService.getAll();
    }

    @GetMapping("/ad/{id}")
    public GetAdsByIdResponse getAdById(@PathVariable int id){
        return adsService.getById(id);
    }

    @GetMapping("/categories")
    public List<GetAllCategoriesResponse> getAllCategories(){
        return categoryService.getAll();
    }


    @GetMapping("/services")
    public List<GetAllServicesResponse> getAllServices(){
        return iService.getAll();
    }

    @GetMapping("/service/{id}")
    public GetServiceByIdResponse getServiceById(@PathVariable int id){
        return iService.getById(id);
    }

    @GetMapping("/job_titles")
    public List<GetAllJobTitlesResponse> getAllJobTitlesResponseList(){
        return jobTitleService.getAllJobTitlesResponseList();
    }

    @PostMapping("/service")
    public void addService(@RequestBody CreateServiceRequest createServiceRequest){
        this.iService.add(createServiceRequest);
    }

    @PostMapping("/category")
    public void addCategory(@RequestBody CreateCategoryRequest createCategoryRequest){
        this.categoryService.add(createCategoryRequest);
    }

    @PostMapping("/ad")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addAd(@RequestBody CreateAdsRequest createAdsRequest){
        this.adsService.add(createAdsRequest);
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addUser(@RequestBody CreateUserRequest createUserRequest){
        this.userService.add(createUserRequest);
    }
    @PostMapping("/job_titles")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addJobTitle(@RequestBody CreateJobTitleRequest jobTitleRequest){
        this.jobTitleService.add(jobTitleRequest);
    }

    @PutMapping("/{id}")
    public void updateUser(@RequestBody UpdateUserRequest updateUserRequest){
        this.userService.update(updateUserRequest);
    }
    @PutMapping("/service_update/{id}")
    public void updateService(@RequestBody UpdateServiceRequest updateServiceRequest){
        this.iService.update(updateServiceRequest);
    }

    @PutMapping("/ad_update/{id}")
    public void updateAd(@RequestBody UpdateAdsRequest updateAdsRequest){
        this.adsService.update(updateAdsRequest);
    }

    @PutMapping("/category_update/{id}")
    public void updateCategory(@RequestBody UpdateCategoryRequest updateCategoryRequest){
        this.categoryService.update(updateCategoryRequest);
    }
    @PutMapping("/job_titles_update")
    public void updateJobTitle(@RequestBody UpdateJobTitleRequest jobTitleRequest){
        this.jobTitleService.update(jobTitleRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id){
        this.userService.delete(id);
    }

    @DeleteMapping("/ad/{id}")
    public void deleteAd(@PathVariable int id){
        this.adsService.delete(id);
    }

    @DeleteMapping("/service/{id}")
    public void deleteService(@PathVariable int id){
        this.iService.delete(id);
    }

    @DeleteMapping("/category/{id}")
    public void deleteCategory(@PathVariable int id){
        this.categoryService.delete(id);
    }

    @DeleteMapping("/job_titles/{id}")
    public void deleteJobTitle(@PathVariable int id){
        this.jobTitleService.delete(id);
    }

}
