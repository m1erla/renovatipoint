package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.RegisterRequest;
import com.werkspot.security.config.SecurityPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserManager implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserManager.class);
    private ModelMapperService modelMapperService;
    private UserRepository userRepository;
    private UserBusinessRules userBusinessRules;

    public UserManager(ModelMapperService modelMapperService, UserRepository userRepository, UserBusinessRules userBusinessRules) {
        this.modelMapperService = modelMapperService;
        this.userRepository = userRepository;
        this.userBusinessRules = userBusinessRules;
    }

    public User findCurrentUser(String email) {
        Optional<User> loggedInUser = userRepository.findByEmail(email);

        // or throw an exception
        return loggedInUser.flatMap(user -> userRepository.findById(user.getId())).orElse(null);

    }
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        Optional<User> user = userRepository.findByEmail(username);
//
//        if (user.isEmpty()){
//            throw new UsernameNotFoundException("User not found with this email - " + username);
//        }
//
//
//        return new org.springframework.security.core.userdetails.User(findCurrentUser().getEmail(), findCurrentUser().getPassword(), findCurrentUser().getAuthorities());
//
//    }
private Object dtoMapperRequestDtoToUser(RegisterRequest request){
    User target = new User();
    target.setName(request.getName());
    target.setSurname(request.getSurname());
    target.setEmail(request.getEmail());
    target.setJobTitleName(request.getJobTitleName());
    target.setPassword(request.getPassword());
    target.setPostCode(request.getPostCode());
    target.setPhoneNumber(request.getPhoneNumber());

    return target;
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
        Optional<User> userOptional = this.userRepository.findByEmail(jwt);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            User response = this.modelMapperService.forResponse().map(user, User.class);
            return response;
        } else {
            // Handle the case where no user is found with the provided email (jwt)
            // You can throw a specific exception, return null, or handle it according to your needs.
            throw new BusinessException("User not found with the provided JWT");
        }
    }


    @Override
    public GetUsersResponse getByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);

        GetUsersResponse response =
                this.modelMapperService.forResponse().map(user, GetUsersResponse.class);

        return response;
    }

    @Override
    public UserDetails getByDetails(String details) {
        return userRepository.findByEmail(details).orElseThrow(() -> new UsernameNotFoundException("User not found"));
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
