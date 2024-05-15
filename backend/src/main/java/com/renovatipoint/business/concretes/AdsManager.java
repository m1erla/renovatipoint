package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.AdsService;
import com.renovatipoint.business.requests.CreateAdsRequest;
import com.renovatipoint.business.requests.UpdateAdsRequest;
import com.renovatipoint.business.responses.GetAdsByIdResponse;
import com.renovatipoint.business.responses.GetAllAdsResponse;
import com.renovatipoint.business.rules.AdsBusinessRules;
import com.renovatipoint.core.utilities.mappers.ModelMapperService;
import com.renovatipoint.dataAccess.abstracts.AdsRepository;
import com.renovatipoint.dataAccess.abstracts.CategoryRepository;
import com.renovatipoint.dataAccess.abstracts.ServiceRepository;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.Ads;
import com.renovatipoint.entities.concretes.Category;
import com.renovatipoint.entities.concretes.ServiceEntity;
import com.renovatipoint.entities.concretes.User;
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
