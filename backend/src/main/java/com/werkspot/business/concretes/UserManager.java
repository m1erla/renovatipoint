package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.Ads;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.config.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserManager implements UserService {
    private ModelMapperService modelMapperService;
    private UserRepository userRepository;
    private UserBusinessRules userBusinessRules;
    private AdsRepository adsRepository;

    @Override
    public List<GetAllUsersResponse> getAll() {
        List<User> users = userRepository.findAll();

        List<GetAllUsersResponse> usersResponses =
                users.stream().map(user ->
                        this.modelMapperService
                                .forResponse()
                                .map(user, GetAllUsersResponse.class))
                        .collect(Collectors.toList());
        return usersResponses;
    }



    @Override
    public GetUserByTokenResponse getUserByJwt(String jwt) {
        User user = this.userRepository.findByEmail(jwt).orElseThrow();
        GetUserByTokenResponse response =
                this.modelMapperService.forResponse().map(user, GetUserByTokenResponse.class);
        return response;
    }


    @Override
    public GetUsersByEmailResponse getByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);

        GetUsersByEmailResponse response =
                this.modelMapperService.forResponse().map(user, GetUsersByEmailResponse.class);

        return response;
    }

    @Override
    public GetUsersByIdResponse getById(int id) {
        User user = this.userRepository.findById(id).orElseThrow();

        GetUsersByIdResponse response =
                this.modelMapperService.forResponse().map(user, GetUsersByIdResponse.class);
        return response;
    }


    @Override
    public void add(CreateUserRequest createUserRequest) {
       this.userBusinessRules.checkIfEmailExists(createUserRequest.getEmail());
       User user = this.modelMapperService
               .forRequest()
               .map(createUserRequest, User.class);
       this.userRepository.save(user);
    }

    @Override
    public void update(UpdateUserRequest updateUserRequest) {
         User user = this.modelMapperService.forRequest().map(updateUserRequest, User.class);
         this.userRepository.save(user);
    }

    @Override
    public void delete(int id) {
        this.userRepository.deleteById(id);

    }
}
