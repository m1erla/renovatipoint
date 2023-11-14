package com.werkspot.webApi.controllers;

import com.werkspot.business.concretes.StorageManager;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/images")
@AllArgsConstructor
public class ImagesController {

    @Autowired
    private StorageManager manager;
    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image")MultipartFile file) throws IOException {
           String uploadImage = manager.uploadImage(file);
           return ResponseEntity.status(HttpStatus.OK)
                   .body(uploadImage);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<?> downloadImage(@PathVariable String fileName) {
       byte[] imageData = manager.downloadImage(fileName);
       return ResponseEntity.status(HttpStatus.OK)
               .contentType(MediaType.valueOf("images/png")).body(imageData);
    }
}
