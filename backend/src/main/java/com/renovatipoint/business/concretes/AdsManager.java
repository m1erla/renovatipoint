package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.AdsService;
import com.renovatipoint.business.requests.CreateAdsRequest;
import com.renovatipoint.business.requests.UpdateAdsRequest;
import com.renovatipoint.business.responses.GetAdsByIdResponse;
import com.renovatipoint.business.responses.GetAllAdsResponse;
import com.renovatipoint.business.responses.GetAllImagesResponse;
import com.renovatipoint.business.rules.AdsBusinessRules;
import com.renovatipoint.core.utilities.mappers.ModelMapperService;
import com.renovatipoint.dataAccess.abstracts.*;
import com.renovatipoint.entities.concretes.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final StorageManager storageManager;
    private final StorageRepository storageRepository;

    public AdsManager(ModelMapperService modelMapperService, AdsRepository adsRepository, AdsBusinessRules adsBusinessRules, CategoryRepository categoryRepository, ServiceRepository serviceRepository, UserRepository userRepository, StorageManager storageManager, StorageRepository storageRepository) {
        this.modelMapperService = modelMapperService;
        this.adsRepository = adsRepository;
        this.adsBusinessRules = adsBusinessRules;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.storageManager = storageManager;
        this.storageRepository = storageRepository;
    }

    @Override
    public List<GetAllAdsResponse> getAll() {
        List<Ads> ads = this.adsRepository.findAll();

        return ads.stream().map(ad -> this.modelMapperService.forResponse().map(ad, GetAllAdsResponse.class)).collect(Collectors.toList());
    }

    @Override
    public GetAdsByIdResponse getById(int id) {
        Ads ads = this.adsRepository.findById(id).orElseThrow();

        return this.modelMapperService.forResponse().map(ads, GetAdsByIdResponse.class);
    }

    public ResponseEntity<?> getAdImagesForUser(int userId){
        List<Ads> adsList = adsRepository.findByUserId(userId);

        if (adsList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No ads found for this user");
        }

        List<GetAllImagesResponse> imageResponses = adsList.stream()
                .flatMap(ads -> ads.getStorages().stream())
                .map(image -> {
                    GetAllImagesResponse response = new GetAllImagesResponse();
                    response.setId(image.getId());
                    response.setName(image.getName());
                    response.setType(image.getType());
                    response.setUrl(image.getUrl());
                    return response;
                })
                .collect(Collectors.toList());

        if (imageResponses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No images found for this user's ads");
        }

        return ResponseEntity.ok(imageResponses);
    }
    @Override
    @Transactional
    public ResponseEntity<?> add(CreateAdsRequest createAdsRequest) {
        System.out.println("Received create ad request: " + createAdsRequest); // Logging

        if (adsBusinessRules.checkIfAdsNameExists(createAdsRequest.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("This ad name already exists. Please try a different name to create a new ad!");
        }

        if (createAdsRequest.getDescriptions().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The description field cannot be empty!");
        }

        Category category = categoryRepository.findById(createAdsRequest.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found!"));

        ServiceEntity service = serviceRepository.findById(createAdsRequest.getServiceId())
                .orElseThrow(() -> new EntityNotFoundException("Service not found!"));

        User user = userRepository.findById(createAdsRequest.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        user = userRepository.findById(user.getId()).orElseThrow(() -> new EntityNotFoundException("User not found!"));

        Ads ads = this.modelMapperService.forRequest().map(createAdsRequest, Ads.class);

        ads.setUser(user);
        ads.setCategory(category);
        ads.setService(service);
        this.adsRepository.save(ads);

        // Handle image upload
        try {
            if (createAdsRequest.getStorages() != null && !createAdsRequest.getStorages().isEmpty()) {
                List<String> fileNames = storageManager.uploadImages(createAdsRequest.getStorages(), user, ads);
                ads.setImageUrl(fileNames.get(0));
                ads.setStorages(ads.getStorages());
                this.adsRepository.save(ads);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload ad images.");
        }

        return ResponseEntity.ok().body("Ad successfully created!");
    }


    @Override
    @Transactional
    public ResponseEntity<?> update(UpdateAdsRequest updateAdsRequest) {
        this.adsBusinessRules.checkIfAdsExists(updateAdsRequest.getId(), updateAdsRequest.getName());
        Ads ads = this.modelMapperService.forRequest().map(updateAdsRequest, Ads.class);

        this.adsRepository.save(ads);

        return ResponseEntity.ok().body("Ad successfully updated!");
    }
    @Transactional
    public List<String> uploadAdImage(int id, List<MultipartFile> files) throws IOException{
        assert adsRepository != null;
        Ads ads = adsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ad not found"));
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        assert storageManager != null;
        List<String> fileNames = storageManager.uploadImages(files, user, ads);
        ads.setImageUrl(fileNames.get(0));
        user.setId(user.getId());
        adsRepository.save(ads);
        return fileNames;
    }


    @Transactional
    public ResponseEntity<?> getAdImage(int id){
        Ads ads = adsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ad not found"));
        List<Storage> storages = ads.getStorages();
        if (storages.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No images found");
        }
        String fileName = ads.getImageUrl();
        return storageManager.serveImage(fileName);
    }
    @Transactional
    public ResponseEntity<?> deleteAdImage(int id){
        Storage storage = storageRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Image not found"));
        Ads ads = storage.getAds();
        if (ads != null && !ads.getImageUrl().isEmpty()){
            ads.getStorages().remove(storage);
            ads.setImageUrl(null);
            adsRepository.save(ads);
        }
        storageRepository.deleteByName(storage.getName());
        storageRepository.delete(storage);
        return ResponseEntity.ok("Image deleted successfully");
    }
    @Transactional
    public String updateAdImage(int id, List<MultipartFile> files) throws IOException{
        Storage storage = storageRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Image not found!"));
        Ads ads = adsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ads not found!"));
        // Delete old images if needed
        String oldStorages = storage.getName();
        if (oldStorages != null && !oldStorages.isEmpty()){
                storageManager.deleteImage(storage.getName());
                storageRepository.delete(storage);
            }

        List<String> fileNames = uploadAdImage(id, files);
        ads.setImageUrl(fileNames.get(0));
        adsRepository.save(ads);
        return "Ad images updated successfully: " + String.join(",", fileNames);
    }

    @Override
    public void delete(int id) {
        this.adsRepository.deleteById(id);
    }
}
