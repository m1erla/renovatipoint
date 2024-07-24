package com.renovatipoint.business.abstracts;

import com.renovatipoint.business.requests.UpdateUserRequest;
import com.renovatipoint.business.responses.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

public interface UserService {
    List<GetUsersResponse> getAll();

    //User getUserByJwt(String jwt);

    GetUsersResponse getByEmail(String email);
  //  UserDetails getByDetails(String details);

    GetUsersResponse getById(int id);

    ResponseEntity<?> update(UpdateUserRequest updateUserRequest);

    ResponseEntity<?> uploadUserProfileImage(MultipartFile file, int id) throws IOException;

    ResponseEntity<?> getUserProfileImage(int id);

    ResponseEntity<?> getImageWithFileName(String email);

    ResponseEntity<?> deleteUserProfileImage(int id);;


}
