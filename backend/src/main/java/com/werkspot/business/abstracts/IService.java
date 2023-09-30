package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateServiceRequest;
import com.werkspot.business.requests.UpdateServiceRequest;
import com.werkspot.business.responses.GetAllServicesResponse;
import com.werkspot.business.responses.GetServiceByIdResponse;

import java.util.List;

public interface IService {

    List<GetAllServicesResponse> getAll();

    GetServiceByIdResponse getById(int id);

    void add(CreateServiceRequest createServiceRequest);

    void update(UpdateServiceRequest updateServiceRequest);

    void delete(int id);

}
