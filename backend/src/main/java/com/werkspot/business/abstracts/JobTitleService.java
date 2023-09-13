package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateJobTitleRequest;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface JobTitleService {
    List<GetAllJobTitlesResponse> getAllJobTitlesResponseList();

    public void add(CreateJobTitleRequest createJobTitleRequest);
}
