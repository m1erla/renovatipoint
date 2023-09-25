package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.AdsService;
import com.werkspot.business.abstracts.ConsumerService;
import com.werkspot.business.abstracts.MasterService;
import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateAdsRequest;
import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateAdsRequest;
import com.werkspot.business.requests.UpdateUserRequest;
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
    private ConsumerService consumerService;
    private AdsService adsService;

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

    @GetMapping("/consumers")
    public List<GetAllConsumersResponse> getAllConsumers(){
        return consumerService.getAll();
    }

    @PostMapping("/ad")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addAd(@RequestBody CreateAdsRequest createAdsRequest){
        this.adsService.add(createAdsRequest);
    }

    @PostMapping()
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addUser(@RequestBody CreateUserRequest createUserRequest){
        this.userService.add(createUserRequest);
    }

    @PutMapping
    public void updateUser(@RequestBody UpdateUserRequest updateUserRequest){
        this.userService.update(updateUserRequest);
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



}
