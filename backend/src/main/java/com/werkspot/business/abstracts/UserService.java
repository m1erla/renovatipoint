package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.security.token.Token;

import java.util.List;

public interface UserService {
    List<GetAllUsersResponse> getAll();

    GetAllByIdMastersResponse getMasterById(int id);

    GetUserByTokenResponse getUserByToken(List<Token> token);

//    GetUserByTokenResponse getUserByToken(String token);

    GetAllByIdConsumersResponse getConsumerById(int id);

    GetUsersByEmailResponse getByEmail(String email);
    GetAdsByIdResponse getAdById(int id);

    List<GetAllAdsResponse> getAllAds();

    GetUsersByIdResponse getById(int id);

    void add(CreateUserRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(int id);
}
