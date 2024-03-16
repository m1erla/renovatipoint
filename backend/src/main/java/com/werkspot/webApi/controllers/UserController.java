package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.*;
import com.werkspot.business.concretes.UserManager;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.AuthenticationRequest;
import com.werkspot.security.auth.AuthenticationService;
import com.werkspot.security.auth.RegisterRequest;
import com.werkspot.security.config.JwtService;
import com.werkspot.security.token.Token;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final UserDetailsService userDetailsServiceImpl;

    private final UserManager userServiceManager;
    private final AuthenticationService service;
    private final JwtService jwtService;

    public UserController(UserService userService, UserDetailsService userDetailsServiceImpl, UserManager userServiceManager, AuthenticationService service, JwtService jwtService) {
        this.userService = userService;
        this.userDetailsServiceImpl = userDetailsServiceImpl;
        this.userServiceManager= userServiceManager;
        this.service= service;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<GetUsersResponse> getAllUsers(){
        return userService.getAll();
    }


    @GetMapping("/{id}")
    public GetUsersByIdResponse getUsersById(@PathVariable int id){
        return userService.getById(id);
    }



    @GetMapping("/response")
    public ResponseEntity<GetUsersResponse> retrieveUserProfileWithResponse(@RequestHeader("Authorization") String authorizationHeader) {
        // Extract the token from the Authorization header (remove "Bearer " prefix)
        String jwt = authorizationHeader.substring(7).trim();

        String email = jwtService.extractUsername(jwt);
        return ResponseEntity.ok(userService.getByEmail(email));
    }


    @PatchMapping
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request, Principal connectedUser
    ){
        userServiceManager.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addUser(@RequestBody RegisterRequest createUserRequest){
        this.userService.add(createUserRequest);
    }


    @PutMapping("/{id}")
    public void updateUser(@RequestBody UpdateUserRequest updateUserRequest){
        this.userService.update(updateUserRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id){
        this.userService.delete(id);
    }
}

