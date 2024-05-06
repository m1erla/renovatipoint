package com.werkspot.business.abstracts;

import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.entities.concretes.User;
import com.werkspot.business.requests.RegisterRequest;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserService {
    List<GetUsersResponse> getAll();


    User getUserByJwt(String jwt);

    GetUsersResponse getByEmail(String email);
    UserDetails getByDetails(String details);

    GetUsersByIdResponse getById(int id);

    void add(RegisterRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(int id);
}
