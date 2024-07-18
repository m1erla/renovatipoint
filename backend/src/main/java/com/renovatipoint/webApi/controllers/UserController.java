package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.abstracts.*;
import com.renovatipoint.business.concretes.StorageManager;
import com.renovatipoint.business.concretes.UserManager;
import com.renovatipoint.business.requests.*;
import com.renovatipoint.business.responses.*;
import com.renovatipoint.entities.concretes.User;
import com.renovatipoint.security.auth.AuthenticationService;
import com.renovatipoint.security.jwt.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserDetailsService userDetailsServiceImpl;

    private final UserManager userManager;

    private final StorageManager storageManager;
    private final AuthenticationService service;
    private final JwtService jwtService;


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
        return userManager.changePassword(request, connectedUser);
    }
    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadUserProfileImage(@RequestParam("file") MultipartFile file, @PathVariable User id) throws IOException {
        return userManager.uploadUserProfileImage(file, id.getId());
    }
    @PostMapping("{id}/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file, @PathVariable int id){
        try {
            ResponseEntity<?> message = userManager.uploadUserProfileImage(file, id);
            return ResponseEntity.ok(message);
        } catch (IOException ex) {
            return ResponseEntity.status(500).body("Failed to upload profile image");
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@ModelAttribute UpdateUserRequest updateUserRequest) throws IOException {
       return this.userManager.update(updateUserRequest);
    }
    @GetMapping("/{id}/profile-image")
    public ResponseEntity<?> getUserProfileImage(@PathVariable int id) {
        return userManager.getUserProfileImage(id);
    }

    @PutMapping("/{id}/profile-image")
    public ResponseEntity<?> updateProfileImage(@PathVariable int id, @RequestParam("file") MultipartFile file) throws IOException {
        return userManager.updateProfileImage(id, file);
    }
    @DeleteMapping("/{fileName}/profile-image")
    public void deleteUserProfileImage(@PathVariable String fileName) throws IOException {
        storageManager.deleteImage(fileName);
    }
    @PostMapping("{id}/updateProfileImage")
    public ResponseEntity<?> updateImage(@PathVariable int id, @RequestParam("file") MultipartFile file){
        try {
            return userManager.updateProfileImage(id, file);
        }catch (IOException ex){
            return ResponseEntity.status(500).body("Failed to update profile images");
        }
    }
    @GetMapping("profileImage/{id}")
    public ResponseEntity<?> getUserImage(@PathVariable int id) throws IOException{
        return userManager.getUserProfileImage(id);
    }

}

