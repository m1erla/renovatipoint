package com.werkspot.security.auth;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.concretes.UserManager;
import com.werkspot.business.responses.EntityResponse;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.security.config.JwtService;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final AuthenticationService service;
    private final UserBusinessRules userBusinessRules;
    private final UserDetailsService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request
    ){

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

    @RequestMapping(value = "/authenticater", method = RequestMethod.POST)
    public ResponseEntity<Object> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest)
            throws Exception {

        try {
            authenticate(authenticationRequest.getEmail(), authenticationRequest.getPassword());
        } catch (Exception e) {
            return EntityResponse.generateResponse("Authentication", HttpStatus.UNAUTHORIZED,
                    "Invalid credentials, please check details and try again.");
        }
        final UserDetails userDetails = userService.loadUserByUsername(authenticationRequest.getEmail());

        final String accessToken = jwtService.generateToken(userDetails);
        final String refreshToken = jwtService.generateRefreshToken(userDetails);

        return EntityResponse.generateResponse("Authentication", HttpStatus.OK,
                new AuthenticationResponse(accessToken));

    }
    private void authenticate(String email, String password) throws Exception {
        try {
           authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }catch(Exception e) {
            throw new Exception("INVALID_CREDENTIALS", e.getCause());

        }
    }


    @PostMapping("/registered")
    public ResponseEntity<Object> registered(@RequestBody RegisterRequest request){
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        return EntityResponse.generateResponse("Register User", HttpStatus.OK, service.register(request));
    }


    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
                 service.refreshToken(request, response);
    }

}
