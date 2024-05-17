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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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
    public ResponseEntity<?> add(CreateAdsRequest createAdsRequest) {
        System.out.println("Received create ad request: " + createAdsRequest); // Logging
        if (adsBusinessRules.checkIfAdsNameExists(createAdsRequest.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("This ad name already exists. Please try a different name to create a new ad!");
        }
        if (createAdsRequest.getDescriptions().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The description field cannot be empty!");
        }
        this.adsBusinessRules.checkIfAdsNameExists(createAdsRequest.getName());
        Category category = categoryRepository.findById(createAdsRequest.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found!"));

        ServiceEntity service = serviceRepository.findById(createAdsRequest.getServiceId()).orElseThrow(() -> new EntityNotFoundException("Service not found!"));
        User user = userRepository.findById(createAdsRequest.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found!"));

        Ads ads = this.modelMapperService.forRequest().map(createAdsRequest, Ads.class);

        ads.setUser(user);
        ads.setCategory(category);
        ads.setService(service);
        this.adsRepository.save(ads);
        return ResponseEntity.ok().body("Ad successfully created!");

    }

//    @Override
//    public ResponseEntity<?> add(CreateAdsRequest createAdsRequest) {
//        System.out.println("Received create ad request: " + createAdsRequest); // Logging
//        if (adsBusinessRules.checkIfAdsNameExists(createAdsRequest.getName())) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body("This ad name already exists. Please try a different name to create a new ad!");
//        }
//        if (createAdsRequest.getDescriptions().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The description field cannot be empty!");
//        }
//        Optional<Category> categoryOpt = categoryRepository.findById(createAdsRequest.getCategoryId());
//        if (!categoryOpt.isPresent()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found!");
//        }
//
//        Optional<ServiceEntity> serviceOpt = serviceRepository.findById(createAdsRequest.getServiceId());
//        if (!serviceOpt.isPresent()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service not found!");
//        }
//
//        Optional<User> userOpt = userRepository.findById(createAdsRequest.getUserId());
//        if (!userOpt.isPresent()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
//        }
//
//        Ads ads = this.modelMapperService.forRequest().map(createAdsRequest, Ads.class);
//        ads.setUser(userOpt.get());
//        ads.setCategory(categoryOpt.get());
//        ads.setService(serviceOpt.get());
//
//        Ads savedAds = adsRepository.save(ads);
//        System.out.println("Saved ad: " + savedAds);
//        return ResponseEntity.ok().body("Ad created successfully!");
//
//    }

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
