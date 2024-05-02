package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.AdsService;
import com.werkspot.business.requests.CreateAdsRequest;
import com.werkspot.business.requests.UpdateAdsRequest;
import com.werkspot.business.responses.GetAdsByIdResponse;
import com.werkspot.business.responses.GetAllAdsResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/ads")
@AllArgsConstructor
public class AdsController {
    private AdsService adsService;

    @GetMapping
    public List<GetAllAdsResponse> getAllAds(){
        return adsService.getAll();
    }

    @GetMapping("/{id}")
    public GetAdsByIdResponse getAdById(@PathVariable int id){
        return adsService.getById(id);
    }

    @PostMapping("/ad")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addAd(@RequestBody CreateAdsRequest createAdsRequest){
        this.adsService.add(createAdsRequest);
    }

    @PutMapping("/ad_update/{id}")
    public void updateAd(@RequestBody UpdateAdsRequest updateAdsRequest){
        this.adsService.update(updateAdsRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteAd(@PathVariable int id){
        this.adsService.delete(id);
    }
}
