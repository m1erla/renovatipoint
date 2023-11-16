package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.*;
import com.werkspot.business.requests.*;
import com.werkspot.business.responses.*;
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

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
@CrossOrigin(origins = "https://myklus.onrender.com", allowCredentials = "*", allowedHeaders = "*")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<GetAllUsersResponse> getAllUsers(){
        return userService.getAll();
    }

    @GetMapping( "/{token}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetUserByTokenResponse> confirmUser(@PathVariable String token){
        GetUserByTokenResponse response = userService.getUserByToken(token);
        if (response != null){
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/getToken")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> getToken(@RequestHeader HttpHeaders header){
        try {
            String userId = jwtService.decodeToken(header, "c8146b630205b8b3bc8c255b2eb2757f874e27ab40c478c0d2f93e8dbfb3418b");
            return ResponseEntity.status(HttpStatus.OK).body(userId);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Token!");
        }
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
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
