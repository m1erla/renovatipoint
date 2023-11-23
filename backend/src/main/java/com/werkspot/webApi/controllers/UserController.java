package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.*;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.AuthenticationResponse;
import com.werkspot.security.auth.RegisterRequest;
import com.werkspot.security.service.UserDetailsServiceImpl;
import jdk.jshell.spi.ExecutionControl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    public UserController(UserService userService, UserDetailsServiceImpl userDetailsServiceImpl) {
        this.userService = userService;
        this.userDetailsServiceImpl = userDetailsServiceImpl;
    }

    @GetMapping
    public List<GetUsersResponse> getAllUsers(){
        return userService.getAll();
    }


    @GetMapping("/{id}")
    public GetUsersByIdResponse getUsersById(@PathVariable int id){
        return userService.getById(id);
    }

    @GetMapping("/profile")
    public ResponseEntity<Object> getUsersByToken() throws BusinessException{
        return EntityResponse.generateResponse("User Profile", HttpStatus.OK, userDetailsServiceImpl.findCurrentUser());
    }
    @GetMapping("/login")
    public ResponseEntity<User> getUserByToken(@RequestHeader("Authorization") String jwt) throws ExecutionControl.UserException {
        User user = userService.getUserByJwt(jwt);
        return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
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
