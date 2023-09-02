package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.MasterService;
import com.werkspot.business.requests.CreateMasterRequest;
import com.werkspot.business.requests.UpdateMasterRequest;
import com.werkspot.business.responses.GetAllByIdMastersResponse;
import com.werkspot.business.responses.GetAllMastersResponse;
import com.werkspot.business.rules.MasterBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.MasterRepository;
import com.werkspot.entities.concretes.Master;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MasterManager implements MasterService {
    private ModelMapperService modelMapperService;
    private MasterRepository masterRepository;
    private MasterBusinessRules masterBusinessRules;
    @Override
    public List<GetAllMastersResponse> getAll() {
        List<Master> masters = masterRepository.findAll();

        List<GetAllMastersResponse> mastersResponses =
                masters.stream().map(master ->
                        this.modelMapperService.forResponse()
                                .map(master, GetAllMastersResponse.class))
                        .collect(Collectors.toList());
        return mastersResponses;
    }

    @Override
    public GetAllByIdMastersResponse getById(int id) {
        Master master = this.masterRepository.findById(id).orElseThrow();

        GetAllByIdMastersResponse response =
                this.modelMapperService.forResponse().map(master, GetAllByIdMastersResponse.class);
        return response;
    }

    @Override
    public void add(CreateMasterRequest createMasterRequest) {
        this.masterBusinessRules.checkIfInfoExists(createMasterRequest.getName());
        Master master = this.modelMapperService.forRequest().map(createMasterRequest, Master.class);

        this.masterRepository.save(master);
    }

    @Override
    public void update(UpdateMasterRequest updateMasterRequest) {
        Master master = this.modelMapperService.forRequest().map(updateMasterRequest, Master.class);

        this.masterRepository.save(master);

    }

    @Override
    public void delete(int id) {

        this.masterRepository.deleteById(id);

    }
}
