package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.ExpertService;
import com.renovatipoint.business.requests.UpdateExpertRequest;
import com.renovatipoint.business.responses.GetExpertResponse;
import com.renovatipoint.core.utilities.mappers.ModelMapperService;
import com.renovatipoint.dataAccess.abstracts.ExpertRepository;
import com.renovatipoint.dataAccess.abstracts.StorageRepository;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.Expert;
import com.renovatipoint.entities.concretes.Storage;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ExpertManager implements ExpertService {
    private final ExpertRepository expertRepository;

    private final StorageRepository storageRepository;
    private final UserRepository userRepository;

    private final StorageManager storageManager;
    private static final Logger logger = LoggerFactory.getLogger(ExpertManager.class);
    private final ModelMapperService modelMapperService;



    public ExpertManager(ExpertRepository expertRepository, StorageRepository storageRepository, UserRepository userRepository, StorageManager storageManager, ModelMapperService modelMapperService) {
        this.expertRepository = expertRepository;
        this.storageRepository = storageRepository;
        this.userRepository = userRepository;
        this.storageManager = storageManager;
        this.modelMapperService = modelMapperService;

    }

    @Override
    public GetExpertResponse getExpertById(String expertId) {
        Expert expert = this.expertRepository.findById(expertId).orElseThrow();

        return this.modelMapperService.forResponse().map(expert, GetExpertResponse.class);
    }

    @Override
    public Expert getById(String expertId) {
        Expert expert = this.expertRepository.findById(expertId)
                .orElseThrow(() -> new EntityNotFoundException("Expert not found"));
        return this.modelMapperService.forResponse().map(expert, Expert.class);
    }

    @Override
    public GetExpertResponse getByEmail(String email) {
        return null;
    }

    @Override
    public ResponseEntity<?> update(UpdateExpertRequest updateExpertRequest) {
        Expert user = expertRepository.findById(updateExpertRequest.getName()).orElseThrow(() -> new EntityNotFoundException("User not found"));


        this.modelMapperService.forRequest().map(updateExpertRequest, user);

        if (updateExpertRequest.getStorages() != null && !updateExpertRequest.getStorages().isEmpty()){
            try {
                String oldFileName = user.getProfileImage();
                List<Storage> oldStorage = user.getStorages();
                if (oldFileName != null && !oldFileName.isEmpty() && oldStorage != null){
                    storageManager.deleteImage(oldFileName);
                    storageRepository.delete((Storage) oldStorage);
                }
                String newFileName = storageManager.uploadImage(updateExpertRequest.getStorages(), user);
                user.setProfileImage(newFileName);
                user.setStorages(user.getStorages());
                userRepository.save(user);
                expertRepository.save(user);

            }catch (IOException ex){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user profile image");
            }
        }

        this.userRepository.save(user);
        return ResponseEntity.ok().body("User information has been changed successfully!");
    }


}
