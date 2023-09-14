package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.requests.UpdateJobTitleRequest;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job_titles")
@AllArgsConstructor
@CrossOrigin("*")
public class JobTitleController {

   private JobTitleService jobTitleService;
   @GetMapping
   public List<GetAllJobTitlesResponse> getAllJobTitlesResponseList(){
       return jobTitleService.getAllJobTitlesResponseList();
   }

   @PostMapping
   @ResponseStatus(code = HttpStatus.CREATED)
   public void add(@RequestBody CreateJobTitleRequest createJobTitleRequest){
       this.jobTitleService.add(createJobTitleRequest);
   }
   @PutMapping
   public void update(@RequestBody UpdateJobTitleRequest updateJobTitleRequest){
       this.jobTitleService.update(updateJobTitleRequest);
   }

   @DeleteMapping("/{id}")
   public void delete(@PathVariable int id){
       this.jobTitleService.delete(id);
   }
}
