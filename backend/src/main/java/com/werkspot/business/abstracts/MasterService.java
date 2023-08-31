package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateMasterRequest;
import com.werkspot.business.requests.UpdateMasterRequest;
import com.werkspot.business.responses.GetAllByIdMastersResponse;
import com.werkspot.business.responses.GetAllMastersResponse;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public interface MasterService {
    List<GetAllMastersResponse> getAll();

    GetAllByIdMastersResponse getById(int id);

    void add(CreateMasterRequest createMasterRequest);
    void update(UpdateMasterRequest updateMasterRequest);
    void delete(int id);
}
