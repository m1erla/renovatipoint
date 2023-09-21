package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.AdsService;
import com.werkspot.business.requests.CreateAdsRequest;
import com.werkspot.business.requests.UpdateAdsRequest;
import com.werkspot.business.responses.GetAdsByIdResponse;
import com.werkspot.business.responses.GetAllAdsResponse;
import com.werkspot.business.rules.AdsBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdsManager implements AdsService {

    private ModelMapperService modelMapperService;
    private AdsRepository adsRepository;
    private AdsBusinessRules adsBusinessRules;

    @Override
    public List<GetAllAdsResponse> getAll() {
        return null;
    }

    @Override
    public GetAdsByIdResponse getById(int id) {
        return null;
    }

    @Override
    public void add(CreateAdsRequest createAdsRequest) {

    }

    @Override
    public void update(UpdateAdsRequest updateAdsRequest) {

    }

    @Override
    public void delete(int id) {

    }
}
