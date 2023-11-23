package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.RegisterRequest;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<GetUsersResponse> getAll();


    User getUserByJwt(String jwt);

    GetUsersResponse getByEmail(String email);

    GetUsersByIdResponse getById(int id);

    void add(RegisterRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(int id);
}
