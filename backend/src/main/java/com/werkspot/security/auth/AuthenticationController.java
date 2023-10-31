package com.werkspot.security.auth;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateUserRequest;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    private final UserService userService;
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody CreateUserRequest request
    ){
//        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//        System.out.println("The secret key is : " + key);
//        System.out.println(Base64.getEncoder().encodeToString(key.getEncoded()));
        return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<String> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }
    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
                 service.refreshToken(request, response);
    }

}
