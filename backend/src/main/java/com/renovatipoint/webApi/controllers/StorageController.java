package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.concretes.AdsManager;
import com.renovatipoint.business.concretes.StorageManager;
import com.renovatipoint.business.concretes.UserManager;
import com.renovatipoint.business.responses.GetAllImagesResponse;
import com.renovatipoint.entities.concretes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/image")
public class StorageController {

    private final StorageManager fileStorageService;
    private final UserManager userManager;
    private final AdsManager adsManager;
    @Autowired
    public StorageController(StorageManager fileStorageService, UserManager userManager, AdsManager adsManager) {
        this.fileStorageService = fileStorageService;
        this.userManager = userManager;
        this.adsManager = adsManager;
    }

    @GetMapping("/all")
    public ResponseEntity<List<GetAllImagesResponse>> getAllImages(){
        List<GetAllImagesResponse> images = fileStorageService.getAll();
        return ResponseEntity.ok(images);
    }



    @PostMapping("/ads/{id}/uploadAdImage")
    public ResponseEntity<?> uploadAdImage(@PathVariable int id, @RequestParam("file") List<MultipartFile> files){
        try{
            List<String> message = adsManager.uploadAdImage(id, files);
            return ResponseEntity.ok(message);
        }catch (IOException ex){
            return ResponseEntity.status(500).body("Failed to upload ad image");
        }
    }



    @GetMapping("/ads/adImage/{id}")
    public ResponseEntity<?> getAdImage(@PathVariable int id){
        return adsManager.getAdImage(id);
    }

    @PostMapping("/ads/{id}/updateAdImages")
    public ResponseEntity<?> updateAdImages(@PathVariable int id, @RequestParam("file") List<MultipartFile> files){
        try {
            String message = adsManager.updateAdImage(id, files);
            return ResponseEntity.ok(message);
        }catch (IOException ex){
            return ResponseEntity.status(500).body("Failed to update ad images");
        }
    }
    @DeleteMapping("/ads/image/{id}")
    public ResponseEntity<?> deleteAdImage(@PathVariable int id){
        return adsManager.deleteAdImage(id);
    }



}
