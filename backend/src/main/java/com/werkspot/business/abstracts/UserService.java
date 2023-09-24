package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;

import java.util.List;

public interface UserService {
    List<GetAllUsersResponse> getAll();

    GetAllByIdMastersResponse getMasterById(int id);

    GetAllByIdConsumersResponse getConsumerById(int id);

    GetAdsByIdResponse getAdById(int id);

    List<GetAllAdsResponse> getAllAds();



    GetUsersByIdResponse getById(int id);

    void add(CreateUserRequest createUserRequest);
    void update(UpdateUserRequest updateUserRequest);

    void delete(Integer id);
}
