package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.ChangePasswordRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.RegisterRequest;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserManager implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserManager.class);
    private ModelMapperService modelMapperService;
    private UserRepository userRepository;
    private UserBusinessRules userBusinessRules;

    private final PasswordEncoder passwordEncoder;

    public UserManager(ModelMapperService modelMapperService, UserRepository userRepository, UserBusinessRules userBusinessRules, PasswordEncoder passwordEncoder) {
        this.modelMapperService = modelMapperService;
        this.userRepository = userRepository;
        this.userBusinessRules = userBusinessRules;
        this.passwordEncoder = passwordEncoder;
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

    public void changePassword(ChangePasswordRequest request, Principal connectedUser){
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct

        if (!passwordEncoder.matches(request.getConfirmationPassword(), user.getPassword())){
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())){
            throw new IllegalStateException("Password are not the same");
        }
        // update the password
        user.setPassword(passwordEncoder.encode(request.getConfirmationPassword()));

        // save the new password
        userRepository.save(user);
    }

}
