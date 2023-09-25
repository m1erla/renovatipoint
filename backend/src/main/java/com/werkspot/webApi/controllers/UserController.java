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
    private EmploymentService employmentService;

    @GetMapping
    public List<GetAllUsersResponse> getAllUsers(){
        return userService.getAll();
    }
    @GetMapping("/{id}")
    public GetUsersByIdResponse getUsersById(@PathVariable Integer id){
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

    @GetMapping("/user/{id}/ad/{adId}")
    public GetUsersAdById getUsersAdById(@PathVariable int userId, @PathVariable int adId){
        return userService.getUsersAdById(userId, adId);
    }


    @GetMapping("/services")
    public List<GetAllEmploymentResponse> getAllServices(){
        return employmentService.getAll();
    }

    @GetMapping("/service/{id}")
    public GetByIdEmploymentResponse getServiceById(@PathVariable int id){
        return employmentService.getById(id);
    }

    @PostMapping("/service")
    public void addService(@RequestBody CreateEmploymentRequest createEmploymentRequest){
        this.employmentService.add(createEmploymentRequest);
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

    @PutMapping
    public void updateUser(@RequestBody UpdateUserRequest updateUserRequest){
        this.userService.update(updateUserRequest);
    }
    @PutMapping("/service_update")
    public void updateService(@RequestBody UpdateEmploymentRequest updateEmploymentRequest){
        this.employmentService.update(updateEmploymentRequest);
    }

    @PutMapping("/ad_update")
    public void updateAd(@RequestBody UpdateAdsRequest updateAdsRequest){
        this.adsService.update(updateAdsRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id){
        this.userService.delete(id);
    }

    @DeleteMapping("/ad/{id}")
    public void deleteAd(@PathVariable int id){
        this.adsService.delete(id);
    }

    @DeleteMapping("/service/{id}")
    public void deleteService(@PathVariable int id){
        this.employmentService.delete(id);
    }



}
