package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.AdsService;
import com.werkspot.business.requests.CreateAdsRequest;
import com.werkspot.business.requests.UpdateAdsRequest;
import com.werkspot.business.responses.GetAdsByIdResponse;
import com.werkspot.business.responses.GetAllAdsResponse;
import com.werkspot.business.rules.AdsBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import com.werkspot.entities.concretes.Ads;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AdsManager implements AdsService {

    private ModelMapperService modelMapperService;
    private AdsRepository adsRepository;
    private AdsBusinessRules adsBusinessRules;

    @Override
    public List<GetAllAdsResponse> getAll() {
        List<Ads> ads = this.adsRepository.findAll();

        List<GetAllAdsResponse> adsResponses =
                 ads.stream().map(ad -> this.modelMapperService.forResponse().map(ad, GetAllAdsResponse.class)).collect(Collectors.toList());

        return adsResponses;
    }

    @Override
    public GetAdsByIdResponse getById(int id) {
        Ads ads = this.adsRepository.findById(id).orElseThrow();

        GetAdsByIdResponse response =
                this.modelMapperService.forResponse().map(ads, GetAdsByIdResponse.class);
        return response;
    }

    @Override
    public void add(CreateAdsRequest createAdsRequest, int id) {
        this.adsBusinessRules.checkIfAdsNameExists(createAdsRequest.getAdName());
        Ads ads = this.modelMapperService.forRequest().map(createAdsRequest, Ads.class);
        this.adsRepository.save(ads);

    }

    @Override
    public void update(UpdateAdsRequest updateAdsRequest) {
        this.adsBusinessRules.checkIfAdsExists(updateAdsRequest.getId(), updateAdsRequest.getAdName());
        Ads ads = this.modelMapperService.forRequest().map(updateAdsRequest, Ads.class);
        this.adsRepository.save(ads);

    }

    @Override
    public void delete(int id) {
        this.adsRepository.deleteById(id);
    }
}
