package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.concretes.AdsManager;
import com.renovatipoint.business.concretes.StorageManager;
import com.renovatipoint.business.concretes.UserManager;
import com.renovatipoint.business.responses.GetAllImagesResponse;
import com.renovatipoint.entities.concretes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/image")
public class StorageController {
    private final Path uploadPath = Paths.get("src/main/resources/static/uploads");
    private final StorageManager fileStorageService;
    @Autowired
    public StorageController(StorageManager fileStorageService, UserManager userManager, AdsManager adsManager) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<GetAllImagesResponse>> getAllImages(){
        List<GetAllImagesResponse> images = fileStorageService.getAll();
        return ResponseEntity.ok(images);
    }

    @GetMapping(value = "/{fileName:.+}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<Resource> getImage(@PathVariable String fileName){
        try {
            Path file = uploadPath.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()){
                return  ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; fileName=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }else {
                return ResponseEntity.notFound().build();
            }
        }catch (MalformedURLException e){
            return ResponseEntity.notFound().build();
        }
    }






}
