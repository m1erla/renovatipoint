package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.MasterService;
import com.werkspot.business.requests.CreateMasterRequest;
import com.werkspot.business.requests.UpdateMasterRequest;
import com.werkspot.business.responses.GetAllByIdMastersResponse;
import com.werkspot.business.responses.GetAllMastersResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MasterManager implements MasterService {
    @Override
    public List<GetAllMastersResponse> getAll() {
        return null;
    }

    @Override
    public GetAllByIdMastersResponse getById(int id) {
        return null;
    }

    @Override
    public void add(CreateMasterRequest createMasterRequest) {

    }

    @Override
    public void update(UpdateMasterRequest updateMasterRequest) {

    }

    @Override
    public void delete(int id) {

    }
}
