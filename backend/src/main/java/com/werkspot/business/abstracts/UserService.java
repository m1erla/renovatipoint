package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.entities.concretes.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<GetAllUsersResponse> getAll();

    GetAllByIdMastersResponse getMasterById(int id);

    Optional<User> findUserProfileByToken(String token) throws BusinessException;

    GetUserByTokenResponse getUserByToken(String token);

    GetAllByIdConsumersResponse getConsumerById(int id);

    GetUsersByEmailResponse getByEmail(String email);
    GetAdsByIdResponse getAdById(int id);

    List<GetAllAdsResponse> getAllAds();

    GetUsersByIdResponse getById(int id);

    void add(CreateUserRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(int id);
}
