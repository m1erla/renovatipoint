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

    GetAllByIdMastersResponse getMasterById(int id);

    GetUserByTokenResponse findUserProfileByToken(UserDetails token);


    GetAllByIdConsumersResponse getConsumerById(int id);

    GetUsersByEmailResponse getByEmail(String email);
    GetAdsByIdResponse getAdById(int id);

    List<GetAllAdsResponse> getAllAds();

    GetUsersByIdResponse getById(int id);

    void add(CreateUserRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(int id);
}
