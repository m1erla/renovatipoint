package com.renovatipoint.business.abstracts;

import com.renovatipoint.business.requests.UpdateUserRequest;
import com.renovatipoint.business.responses.*;
import com.renovatipoint.entities.concretes.User;
import com.renovatipoint.business.requests.RegisterRequest;
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
