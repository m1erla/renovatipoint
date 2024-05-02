package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.requests.UpdateJobTitleRequest;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/job_titles")
@AllArgsConstructor
public class JobTitleController {
    private JobTitleService jobTitleService;


    @GetMapping
    public List<GetAllJobTitlesResponse> getAllJobTitlesResponseList(){
        return jobTitleService.getAllJobTitlesResponseList();
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addJobTitle(@RequestBody CreateJobTitleRequest jobTitleRequest){
        this.jobTitleService.add(jobTitleRequest);
    }

    @PutMapping("/job_titles_update")
    public void updateJobTitle(@RequestBody UpdateJobTitleRequest jobTitleRequest){
        this.jobTitleService.update(jobTitleRequest);
    }


//    @PostMapping("/category/{categoryName}/jobTitle")
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public void addJobTitleToCategory(@PathVariable String categoryName, @RequestBody CreateJobTitleRequest createJobTitleRequest){
//        this.jobTitleService.addJobTitleToCategory(createJobTitleRequest, categoryName);
//    }

    @DeleteMapping("/{id}")
    public void deleteJobTitle(@PathVariable int id){
        this.jobTitleService.delete(id);
    }
}
