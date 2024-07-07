package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.StorageService;
import com.renovatipoint.business.responses.GetAllImagesResponse;
import com.renovatipoint.core.utilities.images.ImageUtils;
import com.renovatipoint.core.utilities.mappers.ModelMapperService;
import com.renovatipoint.dataAccess.abstracts.AdsRepository;
import com.renovatipoint.dataAccess.abstracts.StorageRepository;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.Ads;
import com.renovatipoint.entities.concretes.Image;
import com.renovatipoint.entities.concretes.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class StorageManager implements StorageService {
    private final String UPLOAD_DIR = "src/main/webapp/uploads/";
    private final UserRepository userRepository;

    private final AdsRepository adsRepository;
    private final StorageRepository storageRepository;

    private final ModelMapperService modelMapperService;

    @Autowired
    public StorageManager(UserRepository userRepository, AdsRepository adsRepository, StorageRepository storageRepository, ModelMapperService modelMapperService) {
        this.userRepository = userRepository;
        this.adsRepository = adsRepository;
        this.storageRepository = storageRepository;
        this.modelMapperService = modelMapperService;
    }

    public String storeFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public String uploadImage(MultipartFile file, User user) throws IOException{

        String fileName = storeFile(file);
        Image imageData = storageRepository.save(Image.builder()
                .name(fileName)
                .type(file.getContentType())
                .imageData(ImageUtils.compressImage(file.getBytes()))
                .url(UPLOAD_DIR + fileName)
                .user(user)
                .build());


        return imageData != null ? fileName : null;
    }

    public List<String> uploadImages(List<MultipartFile> files, User user, Ads ad) throws IOException {
        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = storeFile(file);
            Image imageData = Image.builder()
                    .name(fileName)
                    .type(file.getContentType())
                    .imageData(ImageUtils.compressImage(file.getBytes()))
                    .url(UPLOAD_DIR + fileName)
                    .user(user)
                    .ads(ad)
                    .build();

            storageRepository.save(imageData);
            fileNames.add(fileName);
        }
        return fileNames;
    }
    @Transactional
    public byte[] downloadImage(String fileName) throws IOException{
        Optional<Image> dbImageData = storageRepository.findByName(fileName);
        if (dbImageData.isPresent()) {
            return ImageUtils.decompressImage(dbImageData.get().getImageData());
        } else {
            throw new FileNotFoundException("File not found with name: " + fileName);
        }
    }

//    @Transactional
//    public void deleteImage(String fileName) throws IOException{
//        Optional<Image> imageOptional = storageRepository.findByName(fileName);
//        if (imageOptional.isPresent()){
//            storageRepository.delete(imageOptional.get());
//            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
//            Files.deleteIfExists(filePath);
//        }
//    }
    @Transactional
    public void deleteImage(String fileName) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
        Files.deleteIfExists(filePath);
        storageRepository.deleteByName(fileName);
    }
    // Method to delete files
    public void deleteFile(String fileName) throws IOException{
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
        Files.delete(filePath);
    }
/************************************* Storage Service Implementations *************************************/
    public String uploadUserProfileImage(int id, MultipartFile file) throws IOException{
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.getProfileImage() != null){
            deleteImage(user.getProfileImage());
        }

        String fileName = uploadImage(file, user);
        user.setProfileImage(fileName);
        userRepository.save(user);

        return "Profile image uploaded successfully: " + fileName;
    }

    public List<String> uploadAdImage(int id, List<MultipartFile> files) throws IOException{
        Ads ads = adsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ad not found"));
        List<String> fileNames = uploadImages(files, null, ads);
        ads.setImageUrl(fileNames.get(0));
        adsRepository.save(ads);
        return fileNames;
    }

    public ResponseEntity<?> getUserProfileImage(int id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        String fileName = user.getImage().getName();
        return serveImage(fileName);
    }

    public ResponseEntity<?> getAdImage(int id){
        Ads ads = adsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ad not found"));
        List<Image> images = ads.getImages();
        if (images.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No images found");
        }
        String fileName = ads.getImageUrl();
        return serveImage(fileName);
    }

    public ResponseEntity<?> deleteAdImage(int id){
        Image image = storageRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Image not found"));
        Ads ads = image.getAds();
        if (ads != null){
            ads.getImages().remove(image);
            adsRepository.save(ads);
        }
        storageRepository.delete(image);
        return ResponseEntity.ok("Image deleted successfully");
    }


    public ResponseEntity<?> updateProfileImage(int id, MultipartFile file) throws IOException {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        String oldFileName = user.getProfileImage() != null ? user.getProfileImage() : null;
        String newFileName = storeFile(file);

        Image newImage = Image.builder()
                .name(newFileName)
                .type(file.getContentType())
                .imageData(ImageUtils.compressImage(file.getBytes()))
                .url(newFileName)
                .user(user)
                .build();

        storageRepository.save(newImage);
        user.setProfileImage(String.valueOf(newImage));
        userRepository.save(user);

        if (oldFileName != null && !oldFileName.isEmpty()) {
            // Optional: Remove old image file if needed
            deleteImage(user.getProfileImage());
        }
        return ResponseEntity.ok("Profile image updated successfully: " + newFileName);
    }

    public String updateAdImage(int id, List<MultipartFile> files) throws IOException{
        Ads ads = adsRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Ad not found"));
        User user = userRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("User not found"));

        // Delete old images if needed
        List<Image> oldImages = ads.getImages();
        if (oldImages != null && !oldImages.isEmpty()){
            for (Image image : oldImages){
                storageRepository.delete(image);
            }
            ads.getImages().clear();
        }
        List<String> fileNames = uploadImages(files, user, ads);
        ads.setImageUrl(fileNames.get(0));
        adsRepository.save(ads);
        return "Ad images updated successfully: " + String.join(",", fileNames);
    }
    private ResponseEntity<?> serveImage(String fileName){
        if (fileName == null || fileName.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }

        try {
          byte[] imageData = downloadImage(fileName);
          return ResponseEntity.status(HttpStatus.OK)
                  .contentType(MediaType.IMAGE_JPEG)
                  .body(imageData);
        }catch (IOException ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to load image");
        }
    }


    @Override
    public List<GetAllImagesResponse> getAll() {
        List<Image> images = storageRepository.findAll();

        List<GetAllImagesResponse> response =
                images.stream().map(image -> this.modelMapperService.forResponse().map(image, GetAllImagesResponse.class)).collect(Collectors.toList());
        return response;
    }

//    public ResponseEntity<Resource> getUserProfileImage(int id) throws IOException{
//        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
//        Path imagePath = Paths.get(UPLOAD_DIR, user.getProfileImage());
//
//        Resource resource = new FileSystemResource(imagePath.toFile());
//
//        String fileName= user.getProfileImage();
//
//        String contentType = Files.probeContentType(imagePath);
//        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
//    }
}
