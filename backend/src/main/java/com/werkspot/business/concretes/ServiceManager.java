package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.IService;
import com.werkspot.business.requests.CreateServiceRequest;
import com.werkspot.business.requests.UpdateServiceRequest;
import com.werkspot.business.responses.GetAllServicesResponse;
import com.werkspot.business.responses.GetServiceByIdResponse;
import com.werkspot.business.rules.ServiceBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.ServiceRepository;
import com.werkspot.entities.concretes.Service;

import java.util.List;
import java.util.stream.Collectors;


@org.springframework.stereotype.Service
public class ServiceManager implements IService {


    public final ModelMapperService modelMapperService;
    private final ServiceRepository serviceRepository;
    private final ServiceBusinessRules serviceBusinessRules;

    public ServiceManager(ModelMapperService modelMapperService, ServiceRepository serviceRepository, ServiceBusinessRules serviceBusinessRules) {
        this.modelMapperService = modelMapperService;
        this.serviceRepository = serviceRepository;
        this.serviceBusinessRules = serviceBusinessRules;
    }

    @Override
    public List<GetAllServicesResponse> getAll() {
        List<Service> services = serviceRepository.findAll();

        List<GetAllServicesResponse> employmentResponses =
                services.stream().map(employment -> this.modelMapperService.forResponse()
                        .map(employment, GetAllServicesResponse.class)).collect(Collectors.toList());

        return employmentResponses;
    }

    @Override
    public GetServiceByIdResponse getById(int id) {
        Service service = this.serviceRepository.findById(id).orElseThrow();

        GetServiceByIdResponse response =
                this.modelMapperService.forResponse().map(service, GetServiceByIdResponse.class);
        return response;
    }

    @Override
    public void add(CreateServiceRequest createServiceRequest) {
         this.serviceBusinessRules.checkIfServiceExists(createServiceRequest.getName());
         Service service = this.modelMapperService.forRequest().map(createServiceRequest, Service.class);
         this.serviceRepository.save(service);
    }

    @Override
    public void update(UpdateServiceRequest updateServiceRequest) {
         Service service = this.modelMapperService.forRequest().map(updateServiceRequest, Service.class);
         this.serviceRepository.save(service);
    }

    @Override
    public void delete(int id) {
        this.serviceRepository.deleteById(id);

    }
}
