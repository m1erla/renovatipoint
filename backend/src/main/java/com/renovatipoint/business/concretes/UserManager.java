package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.UserService;
import com.renovatipoint.business.requests.ChangePasswordRequest;
import com.renovatipoint.business.requests.UpdateUserRequest;
import com.renovatipoint.business.responses.*;
import com.renovatipoint.business.rules.UserBusinessRules;
import com.renovatipoint.core.utilities.exceptions.BusinessException;
import com.renovatipoint.core.utilities.mappers.ModelMapperService;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.User;
import com.renovatipoint.business.requests.RegisterRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserManager implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserManager.class);
    private final ModelMapperService modelMapperService;
    private final UserRepository userRepository;
    private final UserBusinessRules userBusinessRules;

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
    public ResponseEntity<?> update(UpdateUserRequest updateUserRequest) {
        Optional<User> userUpt = userRepository.findById(updateUserRequest.getId());
        if (!userUpt.isPresent()){
            throw new ResourceNotFoundException("User not found with id : " + updateUserRequest.getId());
        }

        User existingUser = userUpt.get();


        this.modelMapperService.forRequest().map(updateUserRequest, existingUser);

        this.userRepository.save(existingUser);

        return ResponseEntity.ok().body("User information has been changed successfully!");

    }

    @Override
    public void delete(int id) {
        this.userRepository.deleteById(id);

    }


    public ResponseEntity<?> changePassword(ChangePasswordRequest request, Principal connectedUser){
        UsernamePasswordAuthenticationToken authenticationToken = (UsernamePasswordAuthenticationToken) connectedUser;

        User user = (User) authenticationToken.getPrincipal();

        logger.info("Initiating password change for user: {}", user.getUsername());

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            logger.warn("Wrong current password for user: {}", user.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong password");
        }

        // check if the new password is the same as the current password
        if (request.getPassword().equals(request.getNewPassword())){
            logger.warn("New password is the same as the old password for user: {}", user.getUsername());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("New password cannot be the same as the old password. Please try a different password.");
        }

        // check if the two new passwords match
        if (!request.getNewPassword().equals(request.getConfirmationPassword())){
            logger.warn("New password and confirmation password do not match for user: {}", user.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        logger.info("Password changed successfully for user: {}", user.getUsername());
        return ResponseEntity.ok().body("Password changed successfully");
    }

}
