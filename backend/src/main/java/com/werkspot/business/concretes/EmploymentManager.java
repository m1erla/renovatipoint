package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.EmploymentService;
import com.werkspot.business.requests.CreateEmploymentRequest;
import com.werkspot.business.requests.UpdateEmploymentRequest;
import com.werkspot.business.responses.GetAllEmploymentResponse;
import com.werkspot.business.responses.GetByIdEmploymentResponse;
import com.werkspot.business.rules.EmploymentBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.EmploymentRepository;
import com.werkspot.entities.concretes.Employment;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmploymentManager implements EmploymentService {


    public ModelMapperService modelMapperService;
    private EmploymentRepository employmentRepository;
    private EmploymentBusinessRules employmentBusinessRules;

    @Override
    public List<GetAllEmploymentResponse> getAll() {
        List<Employment> employments = employmentRepository.findAll();

        List<GetAllEmploymentResponse> employmentResponses =
                employments.stream().map(employment -> this.modelMapperService.forResponse()
                        .map(employment, GetAllEmploymentResponse.class)).collect(Collectors.toList());

        return employmentResponses;
    }

    @Override
    public GetByIdEmploymentResponse getById(int id) {
        Employment employment = this.employmentRepository.findById(id).orElseThrow();

        GetByIdEmploymentResponse response =
                this.modelMapperService.forResponse().map(employment, GetByIdEmploymentResponse.class);
        return response;
    }

    @Override
    public void add(CreateEmploymentRequest createEmploymentRequest) {
         this.employmentBusinessRules.checkIfServiceExists(createEmploymentRequest.getServiceName());
         Employment employment = this.modelMapperService.forRequest().map(createEmploymentRequest, Employment.class);
         this.employmentRepository.save(employment);
    }

    @Override
    public void update(UpdateEmploymentRequest updateEmploymentRequest) {
         Employment employment = this.modelMapperService.forRequest().map(updateEmploymentRequest, Employment.class);
         this.employmentRepository.save(employment);
    }

    @Override
    public void delete(int id) {
        this.employmentRepository.deleteById(id);

    }
}
