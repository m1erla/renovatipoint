package com.renovatipoint.business.abstracts;

import com.renovatipoint.business.requests.CreateAdsRequest;
import com.renovatipoint.business.requests.UpdateAdsRequest;
import com.renovatipoint.business.responses.GetAllAdsResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AdsService {

    List<GetAllAdsResponse> getAll();

    GetAllAdsResponse getById(int id);
    ResponseEntity<?> add(CreateAdsRequest createAdsRequest);

    ResponseEntity<?> update(UpdateAdsRequest updateAdsRequest);
    ResponseEntity<?> getAdImagesForUser(int userId);

    List<String> uploadAdImage(int id, List<MultipartFile> files) throws IOException;

    ResponseEntity<?> getAdImages(int id);

    ResponseEntity<?> deleteAdImage(int id);

    String updateAdImage(int id, List<MultipartFile> files) throws IOException;

    void delete(int id);
}
