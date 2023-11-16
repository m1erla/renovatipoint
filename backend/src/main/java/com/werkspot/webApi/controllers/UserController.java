package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.*;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.config.JwtService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {
    private UserService userService;
    private JwtService jwtService;
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<GetAllUsersResponse> getAllUsers(){
        return userService.getAll();
    }

    @GetMapping( "/confirm")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetAllUsersResponse> confirmUser(@RequestParam("token") String token){
        User user = jwtService.decodeToken(token);

        if (user != null) {
            GetAllUsersResponse response = new GetAllUsersResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setSurname(user.getSurname());
            response.setEmail(user.getEmail());
            response.setPhoneNumber(user.getPhoneNumber());
            response.setPostCode(user.getPostCode());
            response.setJobTitleName(user.getJobTitleName());

            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @GetMapping("/{id}")
    public GetUsersByIdResponse getUsersById(@PathVariable int id){
        return userService.getById(id);
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
