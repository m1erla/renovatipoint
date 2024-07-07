package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.concretes.StorageManager;
import com.renovatipoint.business.concretes.UserManager;
import com.renovatipoint.business.responses.GetAllImagesResponse;
import com.renovatipoint.dataAccess.abstracts.AdsRepository;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.Ads;
import com.renovatipoint.entities.concretes.Image;
import com.renovatipoint.entities.concretes.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/image")
public class ImagesController {

    private final StorageManager fileStorageService;
    private final UserRepository userRepository;
    @Autowired
    public ImagesController(StorageManager fileStorageService, UserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<List<GetAllImagesResponse>> getAllImages(){
        List<GetAllImagesResponse> images = fileStorageService.getAll();
        return ResponseEntity.ok(images);
    }

//    @PostMapping("/users/{id}/uploadProfileImage")
//    public ResponseEntity<?> uploadProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile files){
//        try{
//            String message = fileStorageService.uploadUserProfileImage(id, files);
//            return ResponseEntity.ok(message);
//        }catch (IOException ex){
//            return ResponseEntity.status(500).body("Failed to upload profile image");
//        }
//    }

    @PostMapping("/users/{id}/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile file){
        try {
            String message = fileStorageService.uploadUserProfileImage(id, file);
            return ResponseEntity.ok(message);
        } catch (IOException ex) {
            return ResponseEntity.status(500).body("Failed to upload profile image");
        }
    }
    @PostMapping("/ads/{id}/uploadAdImage")
    public ResponseEntity<?> uploadAdImage(@PathVariable int id, @RequestParam("file") List<MultipartFile> files){
        try{
            List<String> message = fileStorageService.uploadAdImage(id, files);
            return ResponseEntity.ok(message);
        }catch (IOException ex){
            return ResponseEntity.status(500).body("Failed to upload ad image");
        }
    }


    @GetMapping("/users/profileImage/{id}")
    public ResponseEntity<?> getUserProfileImage(@PathVariable int id) throws IOException{
      return fileStorageService.getUserProfileImage(id);
    }
    @GetMapping("/ads/adImage/{id}")
    public ResponseEntity<?> getAdImage(@PathVariable int id){
        return fileStorageService.getAdImage(id);
    }

    @PostMapping("/ads/{id}/updateAdImages")
    public ResponseEntity<?> updateAdImages(@PathVariable int id, @RequestParam("file") List<MultipartFile> files){
        try {
            String message = fileStorageService.updateAdImage(id, files);
            return ResponseEntity.ok(message);
        }catch (IOException ex){
            return ResponseEntity.status(500).body("Failed to update ad images");
        }
    }
    @DeleteMapping("/ads/image/{id}")
    public ResponseEntity<?> deleteAdImage(@PathVariable int id){
        return fileStorageService.deleteAdImage(id);
    }
    @PostMapping("/users/{id}/updateProfileImage")
    public ResponseEntity<?> updateProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile file){
        try {
            return fileStorageService.updateProfileImage(id, file);
        }catch (IOException ex){
            return ResponseEntity.status(500).body("Failed to update profile images");
        }
    }


}
