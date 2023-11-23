package com.werkspot.security.auth;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.responses.EntityResponse;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.security.config.JwtService;
import com.werkspot.security.service.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthenticationService service;
    private final UserBusinessRules userBusinessRules;
    private final UserService userService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, JwtService jwtService, AuthenticationService service, UserBusinessRules userBusinessRules, UserService userService, UserDetailsServiceImpl userDetailsServiceImpl, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.service = service;
        this.userBusinessRules = userBusinessRules;
        this.userService = userService;
        this.userDetailsServiceImpl = userDetailsServiceImpl;
        this.passwordEncoder = passwordEncoder;
    }


//    @PostMapping("/register")
//    public ResponseEntity<RegisterResponse> register(
//            @RequestBody CreateUserRequest request
//    ){
////        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
////        System.out.println("The secret key is : " + key);
////        System.out.println(Base64.getEncoder().encodeToString(key.getEncoded()));
//        if (userBusinessRules.userExists(request.getEmail())){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new RegisterResponse("User with this email already exists! ", 0, request.getEmail()));
//        }
//        return ResponseEntity.ok(service.register(request));
//    }
//    @PostMapping("/authenticate")
//    public ResponseEntity<String> authenticate(
//            @RequestBody AuthenticationRequest request
//    ){
//        if(!userBusinessRules.userExists(request.getEmail()) && !userBusinessRules.userExists(request.getPassword())){
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found! Email or password is incorrect!");
//        }
//
//        return ResponseEntity.ok(service.authenticate(request));
//    }

    @PostMapping("/authenticate")
    public ResponseEntity<Object> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest)
            throws Exception {

        try {
            authenticate(authenticationRequest.getEmail(), authenticationRequest.getPassword());
        } catch (Exception e) {
            return EntityResponse.generateResponse("Authentication", HttpStatus.UNAUTHORIZED,
                    "Invalid credentials, please check details and try again.");
        }
        final UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(authenticationRequest.getEmail());

        final String token = jwtService.generateToken(userDetails);
        final String refreshToken = jwtService.generateRefreshToken(userDetails);

        return EntityResponse.generateResponse("Authentication", HttpStatus.OK,
                new AuthResponse(token));

    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }catch(Exception e) {
            throw new Exception("INVALID_CREDENTIALS", e.getCause());

        }
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request){
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
