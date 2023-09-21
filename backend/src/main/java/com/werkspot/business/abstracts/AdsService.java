package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateAdsRequest;
import com.werkspot.business.requests.UpdateAdsRequest;
import com.werkspot.business.responses.GetAdsByIdResponse;
import com.werkspot.business.responses.GetAllAdsResponse;

import java.util.List;

public interface AdsService {

    List<GetAllAdsResponse> getAll();

    GetAdsByIdResponse getById(int id);
    void add(CreateAdsRequest createAdsRequest);

    void update(UpdateAdsRequest updateAdsRequest);

    void delete(int id);
}
