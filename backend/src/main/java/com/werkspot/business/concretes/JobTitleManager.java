package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.requests.UpdateJobTitleRequest;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import com.werkspot.business.rules.JobTitleBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.JobTitleRepository;
import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class JobTitleManager implements JobTitleService {
    private ModelMapperService modelMapperService;
    private JobTitleRepository jobTitleRepository;
    private JobTitleBusinessRules jobTitleBusinessRules;
    @Override
    public List<GetAllJobTitlesResponse> getAllJobTitlesResponseList() {
        List<JobTitle> jobTitles = jobTitleRepository.findAll();

        List<GetAllJobTitlesResponse> jobTitlesResponses =
                jobTitles.stream().map(jobTitle ->
                        this.modelMapperService.forResponse()
                                .map(jobTitle, GetAllJobTitlesResponse.class))
                        .collect(Collectors.toList());

        return jobTitlesResponses;
    }

    @Override
    public void add(CreateJobTitleRequest createJobTitleRequest) {
        this.jobTitleBusinessRules.checkIfJobtitleExists(createJobTitleRequest.getJobTitles());
         JobTitle jobTitle = this.modelMapperService.forRequest()
                 .map(createJobTitleRequest, JobTitle.class);
         this.jobTitleRepository.save(jobTitle);
    }

    @Override
    public void update(UpdateJobTitleRequest updateJobTitleRequest) {
          JobTitle jobTitle = this.modelMapperService.forRequest()
                  .map(updateJobTitleRequest, JobTitle.class);
          this.jobTitleRepository.save(jobTitle);
    }

    @Override
    public void delete(int id) {
        this.jobTitleRepository.deleteById(id);
    }
}
