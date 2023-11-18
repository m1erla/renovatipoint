package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.*;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.config.JwtService;
import com.werkspot.security.token.Token;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_USER')")
    public List<GetAllUsersResponse> getAllUsers(){
        return userService.getAll();
    }


    @GetMapping("/{id}")
    public GetUsersByIdResponse getUsersById(@PathVariable int id){
        return userService.getById(id);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ROLE_USER')")
    public GetUserByTokenResponse confirm(@RequestHeader("Authorization") String token) throws BusinessException{
        return userService.findUserProfileByToken(token);
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addUser(@RequestBody CreateUserRequest createUserRequest){
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
