package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateMasterRequest;
import com.werkspot.business.requests.UpdateMasterRequest;
import com.werkspot.business.responses.GetAllByIdMastersResponse;
import com.werkspot.business.responses.GetAllJobTitlesResponse;
import com.werkspot.business.responses.GetAllMastersResponse;
import com.werkspot.business.responses.GetJobTitlesByName;


import java.util.List;

public interface MasterService {
    List<GetAllMastersResponse> getAll();

    GetAllByIdMastersResponse getById(int id);

    List<GetAllJobTitlesResponse> getAllJobTitles();

    GetJobTitlesByName getJobTitleByName(String jobTitleName);

    void add(CreateMasterRequest createMasterRequest);

    void update(UpdateMasterRequest updateMasterRequest);
    void delete(int id);
}
