package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.IService;
import com.werkspot.business.requests.CreateServiceRequest;
import com.werkspot.business.requests.UpdateServiceRequest;
import com.werkspot.business.responses.GetAllServicesResponse;
import com.werkspot.business.responses.GetServiceByIdResponse;
import com.werkspot.business.rules.ServiceBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.ServiceRepository;
import com.werkspot.entities.concretes.Employment;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class ServiceManager implements IService {


    public ModelMapperService modelMapperService;
    private ServiceRepository serviceRepository;
    private ServiceBusinessRules serviceBusinessRules;

    public ServiceManager(ModelMapperService modelMapperService, ServiceRepository serviceRepository, ServiceBusinessRules serviceBusinessRules) {
        this.modelMapperService = modelMapperService;
        this.serviceRepository = serviceRepository;
        this.serviceBusinessRules = serviceBusinessRules;
    }

    @Override
    public List<GetAllServicesResponse> getAll() {
        List<Employment> services = serviceRepository.findAll();

        List<GetAllServicesResponse> employmentResponses =
                services.stream().map(employment -> this.modelMapperService.forResponse()
                        .map(employment, GetAllServicesResponse.class)).collect(Collectors.toList());

        return employmentResponses;
    }

    @Override
    public GetServiceByIdResponse getById(int id) {
        Employment service = this.serviceRepository.findById(id).orElseThrow();

        GetServiceByIdResponse response =
                this.modelMapperService.forResponse().map(service, GetServiceByIdResponse.class);
        return response;
    }

    @Override
    public void add(CreateServiceRequest createServiceRequest) {
         this.serviceBusinessRules.checkIfServiceExists(createServiceRequest.getName());
         Employment service = this.modelMapperService.forRequest().map(createServiceRequest, Employment.class);
         this.serviceRepository.save(service);
    }

    @Override
    public void update(UpdateServiceRequest updateServiceRequest) {
         Employment service = this.modelMapperService.forRequest().map(updateServiceRequest, Employment.class);
         this.serviceRepository.save(service);
    }

    @Override
    public void delete(int id) {
        this.serviceRepository.deleteById(id);

    }
}
