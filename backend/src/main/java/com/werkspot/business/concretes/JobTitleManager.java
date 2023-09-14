package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.JobTitleService;
import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.JobTitleRepository;
import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class JobTitleManager implements JobTitleService {
    private ModelMapperService modelMapperService;
    private JobTitleRepository jobTitleRepository;
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
         JobTitle jobTitle = this.modelMapperService.forRequest()
                 .map(createJobTitleRequest, JobTitle.class);
         this.jobTitleRepository.save(jobTitle);
    }
}
