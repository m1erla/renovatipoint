package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.EmploymentService;
import com.werkspot.business.requests.CreateEmploymentRequest;
import com.werkspot.business.requests.UpdateEmploymentRequest;
import com.werkspot.business.responses.GetAllEmploymentResponse;
import com.werkspot.business.responses.GetByIdEmploymentResponse;
import com.werkspot.business.rules.EmploymentBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.EmploymentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class EmploymentManager implements EmploymentService {


    public ModelMapperService modelMapperService;
    private EmploymentRepository employmentRepository;
    private EmploymentBusinessRules employmentBusinessRules;

    @Override
    public List<GetAllEmploymentResponse> getAll() {
        return null;
    }

    @Override
    public GetByIdEmploymentResponse getById(int id) {
        return null;
    }

    @Override
    public void add(CreateEmploymentRequest createEmploymentRequest) {

    }

    @Override
    public void update(UpdateEmploymentRequest updateEmploymentRequest) {

    }

    @Override
    public void delete(int id) {

    }
}
