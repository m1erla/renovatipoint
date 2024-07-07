package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.abstracts.AdsService;
import com.renovatipoint.business.requests.CreateAdsRequest;
import com.renovatipoint.business.requests.UpdateAdsRequest;
import com.renovatipoint.business.responses.GetAdsByIdResponse;
import com.renovatipoint.business.responses.GetAllAdsResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping(value = "/ad", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> add(@ModelAttribute CreateAdsRequest createAdsRequest) {
        return adsService.add(createAdsRequest);
    }
    @PutMapping("/ad_update/{id}")
    public void update(@RequestBody UpdateAdsRequest updateAdsRequest){
        this.adsService.update(updateAdsRequest);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        this.adsService.delete(id);
    }
}
