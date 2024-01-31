package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.AdsService;
import com.werkspot.business.requests.CreateAdsRequest;
import com.werkspot.business.requests.UpdateAdsRequest;
import com.werkspot.business.responses.GetAdsByIdResponse;
import com.werkspot.business.responses.GetAllAdsResponse;
import com.werkspot.business.rules.AdsBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import com.werkspot.dataAccess.abstracts.CategoryRepository;
import com.werkspot.dataAccess.abstracts.ServiceRepository;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.Ads;
import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.ServiceEntity;
import com.werkspot.entities.concretes.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdsManager implements AdsService {

    private final ModelMapperService modelMapperService;
    private final AdsRepository adsRepository;
    private final AdsBusinessRules adsBusinessRules;

    private final CategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public AdsManager(ModelMapperService modelMapperService, AdsRepository adsRepository, AdsBusinessRules adsBusinessRules, CategoryRepository categoryRepository, ServiceRepository serviceRepository, UserRepository userRepository) {
        this.modelMapperService = modelMapperService;
        this.adsRepository = adsRepository;
        this.adsBusinessRules = adsBusinessRules;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

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

    public void add(CreateAdsRequest createAdsRequest) {
        this.adsBusinessRules.checkIfAdsNameExists(createAdsRequest.getName());
        Category category = categoryRepository.findById(createAdsRequest.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found!"));

        ServiceEntity service = serviceRepository.findById(createAdsRequest.getServiceId()).orElseThrow(() -> new EntityNotFoundException("Service not found!"));
        User user = userRepository.findById(createAdsRequest.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found!"));

        Ads ads = this.modelMapperService.forRequest().map(createAdsRequest, Ads.class);

        ads.setUser(user);
        ads.setCategory(category);
        ads.setService(service);

        this.adsRepository.save(ads);

    }

    @Override
    public void update(UpdateAdsRequest updateAdsRequest) {
        this.adsBusinessRules.checkIfAdsExists(updateAdsRequest.getId(), updateAdsRequest.getName());
        Ads ads = this.modelMapperService.forRequest().map(updateAdsRequest, Ads.class);
        this.adsRepository.save(ads);

    }

    @Override
    public void delete(int id) {
        this.adsRepository.deleteById(id);
    }
}
