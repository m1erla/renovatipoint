package com.werkspot.security.auth;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.responses.GetUserByTokenResponse;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthenticationService service;
    private final UserBusinessRules userBusinessRules;
    private final UserService userService;
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody CreateUserRequest request
    ){
//        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//        System.out.println("The secret key is : " + key);
//        System.out.println(Base64.getEncoder().encodeToString(key.getEncoded()));
        if (userBusinessRules.userExists(request.getEmail())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RegisterResponse("User with this email already exists! ", 0, request.getEmail()));
        }
        return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<String> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        if(!userBusinessRules.userExists(request.getEmail()) && !userBusinessRules.userExists(request.getPassword())){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found! Email or password is incorrect!");
        }

        return ResponseEntity.ok(service.authenticate(request));
    }
    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
                 service.refreshToken(request, response);
    }

    @GetMapping( "/confirmLogin")
    public ResponseEntity<AuthenticationResponse> confirmLogin(@RequestHeader("Authorization") String confirmLogin){
        Optional<User> response = userService.getUserProfileByToken(confirmLogin);
        if (response.isPresent()){
            return ResponseEntity.ok(service.confirmLogin(confirmLogin));
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }



}
