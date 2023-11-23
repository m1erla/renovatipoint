package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.RegisterRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserManager implements UserService {
    private ModelMapperService modelMapperService;
    private UserRepository userRepository;
    private UserBusinessRules userBusinessRules;

    public UserManager(ModelMapperService modelMapperService, UserRepository userRepository, UserBusinessRules userBusinessRules) {
        this.modelMapperService = modelMapperService;
        this.userRepository = userRepository;
        this.userBusinessRules = userBusinessRules;
    }

    @Override
    public List<GetUsersResponse> getAll() {
        List<User> users = userRepository.findAll();

        List<GetUsersResponse> usersResponses =
                users.stream().map(user ->
                        this.modelMapperService
                                .forResponse()
                                .map(user, GetUsersResponse.class))
                        .collect(Collectors.toList());
        return usersResponses;
    }



    @Override
    public User getUserByJwt(String jwt) {
        User user = this.userRepository.findByEmail(jwt).orElseThrow();
        User response =
                this.modelMapperService.forResponse().map(user, User.class);
        return response;
    }


    @Override
    public GetUsersResponse getByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);

        GetUsersResponse response =
                this.modelMapperService.forResponse().map(user, GetUsersResponse.class);

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
    public void add(RegisterRequest createUserRequest) {
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
