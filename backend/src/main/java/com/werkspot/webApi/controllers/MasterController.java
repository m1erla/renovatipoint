package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.AdsService;
import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.abstracts.MasterService;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/masters")
@AllArgsConstructor
@CrossOrigin("*")
public class MasterController {

    private MasterService masterService;
    private AdsService adsService;
    private JobTitleService jobTitleService;

    @GetMapping
    public List<GetAllMastersResponse> getAll() {
        return masterService.getAll();
    }

    @GetMapping("/{id}")
    public GetAllByIdMastersResponse getById(@PathVariable int id) {
        return masterService.getById(id);
    }
    @GetMapping("/{name}")
    public GetJobTitlesByName getJobTitlesByName(@PathVariable String name){
        return masterService.getJobTitleByName(name);
    }

    @GetMapping("/ad/{id}")
    public GetAdsByIdResponse getAdsByIdResponse(@PathVariable int id){
        return adsService.getById(id);
    }
    @GetMapping("/job_titles")
    public List<GetAllJobTitlesResponse> getAllJobTitlesResponseList(){
        return jobTitleService.getAllJobTitlesResponseList();
    }


    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void add(@RequestBody CreateMasterRequest createMasterRequest){
           this.masterService.add(createMasterRequest);
    }

    @PostMapping("/ad")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addAd(@RequestBody CreateAdsRequest adsRequest, int id){
        this.adsService.add(adsRequest, id);
    }

    @PostMapping("/job_titles")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addJobTitle(@RequestBody CreateJobTitleRequest jobTitleRequest){
        this.jobTitleService.add(jobTitleRequest);
    }

    @PutMapping("/ad_update")
    public void updateAd(@RequestBody UpdateAdsRequest adsRequest){
        this.adsService.update(adsRequest);
    }

    @PutMapping("/job_titles_update")
    public void updateJobTitle(@RequestBody UpdateJobTitleRequest jobTitleRequest){
        this.jobTitleService.update(jobTitleRequest);
    }

    @PutMapping
    public void update(@RequestBody UpdateMasterRequest masterRequest){
        this.masterService.update(masterRequest);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        this.masterService.delete(id);
    }
    @DeleteMapping("/ad/{id}")
    public void deleteAd(@PathVariable int id){
        this.adsService.delete(id);
    }

    @DeleteMapping("/job_titles/{id}")
    public void deleteJobTitle(@PathVariable int id){
        this.jobTitleService.delete(id);
    }

}
