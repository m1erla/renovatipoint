package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateEmploymentRequest;
import com.werkspot.business.requests.UpdateEmploymentRequest;
import com.werkspot.business.responses.GetAllEmploymentResponse;
import com.werkspot.business.responses.GetByIdEmploymentResponse;

import java.util.List;

public interface EmploymentService {

    List<GetAllEmploymentResponse> getAll();

    GetByIdEmploymentResponse getById(int id);

    void add(CreateEmploymentRequest createEmploymentRequest);

    void update(UpdateEmploymentRequest updateEmploymentRequest);

    void delete(int id);

}
