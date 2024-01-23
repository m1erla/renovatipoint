package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.IService;
import com.werkspot.business.requests.CreateServiceRequest;
import com.werkspot.business.requests.UpdateServiceRequest;
import com.werkspot.business.responses.GetAllServicesResponse;
import com.werkspot.business.responses.GetServiceByIdResponse;
import com.werkspot.business.rules.ServiceBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.CategoryRepository;
import com.werkspot.dataAccess.abstracts.JobTitleRepository;
import com.werkspot.dataAccess.abstracts.ServiceRepository;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import com.werkspot.entities.concretes.ServiceEntity;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ServiceManager implements IService {


    public final ModelMapperService modelMapperService;
    private final ServiceRepository serviceRepository;
    private final ServiceBusinessRules serviceBusinessRules;

    private final CategoryRepository categoryRepository;

    private final JobTitleRepository jobTitleRepository;

    public ServiceManager(ModelMapperService modelMapperService, ServiceRepository serviceRepository, ServiceBusinessRules serviceBusinessRules, CategoryRepository categoryRepository, JobTitleRepository jobTitleRepository) {
        this.modelMapperService = modelMapperService;
        this.serviceRepository = serviceRepository;
        this.serviceBusinessRules = serviceBusinessRules;
        this.categoryRepository = categoryRepository;
        this.jobTitleRepository = jobTitleRepository;
    }

    @Override
    public List<GetAllServicesResponse> getAll() {
        List<ServiceEntity> services = serviceRepository.findAll();

        List<GetAllServicesResponse> employmentResponses =
                services.stream().map(employment -> this.modelMapperService.forResponse()
                        .map(employment, GetAllServicesResponse.class)).collect(Collectors.toList());

        return employmentResponses;
    }

    @Override
    public GetServiceByIdResponse getById(int id) {
        ServiceEntity service = this.serviceRepository.findById(id).orElseThrow();

        GetServiceByIdResponse response =
                this.modelMapperService.forResponse().map(service, GetServiceByIdResponse.class);
        return response;
    }

    @Override
    public void add(CreateServiceRequest createServiceRequest) {
         this.serviceBusinessRules.checkIfServiceExists(createServiceRequest.getName());
         Category category = categoryRepository.findByName(createServiceRequest.getCategoryName()).orElseThrow(()-> new EntityNotFoundException("Category not found"));

         JobTitle jobTitle = jobTitleRepository.findByName(createServiceRequest.getJobTitleName()).orElseThrow(() -> new EntityNotFoundException("Job Title not found"));


         ServiceEntity service = this.modelMapperService.forRequest().map(createServiceRequest, ServiceEntity.class);

         service.setCategory(category);
         service.setJobTitle(jobTitle);

         this.serviceRepository.save(service);
    }

    @Override
    public void update(UpdateServiceRequest updateServiceRequest) {
         ServiceEntity service = this.modelMapperService.forRequest().map(updateServiceRequest, ServiceEntity.class);
         this.serviceRepository.save(service);
    }

    @Override
    public void delete(int id) {
        this.serviceRepository.deleteById(id);

    }
}
