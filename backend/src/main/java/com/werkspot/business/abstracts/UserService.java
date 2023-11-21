package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.entities.concretes.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<GetAllUsersResponse> getAll();


    GetUserByTokenResponse getUserByJwt(String jwt);

    GetUsersByEmailResponse getByEmail(String email);

    GetUsersByIdResponse getById(int id);

    void add(CreateUserRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(int id);
}
