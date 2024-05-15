package com.renovatipoint.business.abstracts;

import com.renovatipoint.business.requests.CreateAdsRequest;
import com.renovatipoint.business.requests.UpdateAdsRequest;
import com.renovatipoint.business.responses.GetAdsByIdResponse;
import com.renovatipoint.business.responses.GetAllAdsResponse;

import java.util.List;

public interface AdsService {

    List<GetAllAdsResponse> getAll();

    GetAdsByIdResponse getById(int id);
    void add(CreateAdsRequest createAdsRequest);

    void update(UpdateAdsRequest updateAdsRequest);

    void delete(int id);
}
