package com.werkspot.security.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.responses.GetUsersByEmailResponse;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.security.config.JwtService;
import com.werkspot.entities.concretes.User;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.security.token.Token;
import com.werkspot.security.token.TokenRepository;
import com.werkspot.security.token.TokenType;
import com.werkspot.security.user.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final UserBusinessRules userBusinessRules;

    public RegisterResponse register(CreateUserRequest request){
         var user = User.builder()
                 .name(request.getName())
                 .surname(request.getSurname())
                 .email(request.getEmail())
                 .phoneNumber(request.getPhoneNumber())
                 .password(passwordEncoder.encode(request.getPassword()))
                 .jobTitleName(request.getJobTitleName())
                 .postCode(request.getPostCode())
                 .build();
         var savedUser = repository.save(user);
         var jwtToken = jwtService.generateToken(user);
         var refreshToken = jwtService.generateRefreshToken(user);
         saveUserToken(savedUser, jwtToken);
         RegisterResponse registerResponse = new RegisterResponse();
        if (userService.getByEmail(user.getEmail()) != null) {
           registerResponse.setMessage("Such a user already exists!");
           return  registerResponse;
        }

         return RegisterResponse.builder()
                 .message("User Created Successfully!")
                 .userId(user.getId())
                 .email(user.getEmail())
                 .build();

    }

    public String authenticate( AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return jwtToken;

    }

    private void saveUserToken( User user, String jwtToken){
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens( User user){
        var validConsumerTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if(validConsumerTokens.isEmpty())
            return;
        validConsumerTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validConsumerTokens);
    }
   public void refreshToken(
           HttpServletRequest request,
           HttpServletResponse response
   ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            return;
        }

        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if(userEmail != null){
            var user = this.repository.findByEmail(userEmail).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
            }
        }
   }



