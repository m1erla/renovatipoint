package com.werkspot.business.concretes;

import com.werkspot.core.utilities.images.ImageUtils;
import com.werkspot.dataAccess.abstracts.StorageRepository;
import com.werkspot.entities.concretes.Image;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StorageManager {

    private StorageRepository repository;

    public String uploadImage(MultipartFile file) throws IOException {
        Image imageData = repository.save(Image.builder()
                        .name(file.getOriginalFilename())
                        .type(file.getContentType())
                        .imageData(ImageUtils.compressImage(file.getBytes()))
                .build());

        if (imageData!= null){
            return "Image uploaded successfully : " + file.getOriginalFilename();
        }
        return null;
    }

    public byte[] downloadImage(String fileName){
        Optional<Image> dbImageData = repository.findByName(fileName);
        byte[] images =ImageUtils.decompressImage(dbImageData.get().getImageData());
        return images;
    }
}
