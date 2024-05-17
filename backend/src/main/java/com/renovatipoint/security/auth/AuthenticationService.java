package com.renovatipoint.security.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.renovatipoint.business.requests.RegisterRequest;
import com.renovatipoint.business.responses.RegisterResponse;
import com.renovatipoint.security.jwt.JwtService;
import com.renovatipoint.entities.concretes.User;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.security.token.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService{
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public RegisterResponse register(RegisterRequest request){
        if (repository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalStateException("User with this email already exists!");
        }
        if (repository.findByPhoneNumber(request.getPhoneNumber()).isPresent()){
            throw new IllegalStateException("This phone number is already in use. Please try a different phone number!");
        }
         var user = User.builder()
                 .name(request.getName())
                 .surname(request.getSurname())
                 .email(request.getEmail())
                 .phoneNumber(request.getPhoneNumber())
                 .password(passwordEncoder.encode(request.getPassword()))
                 .jobTitleName(request.getJobTitleName())
                 .postCode(request.getPostCode())
                 .role(request.getRole())
                 .build();
         var savedUser = repository.save(user);
         var jwtToken = jwtService.generateToken(user);
         var refreshToken = jwtService.generateRefreshToken(user);
         saveUserToken(savedUser, jwtToken);

         return RegisterResponse.builder()
                 .message("User Created Successfully!")
                 .userId(user.getId())
                 .email(user.getEmail())
                 .build();

    }

    public AuthenticationResponse confirmLogin(AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .message("User Successfully Login!")
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .surname(user.getSurname())
                .phoneNumber(user.getPhoneNumber())
                .postCode(user.getPostCode())
                .jobTitleName(user.getJobTitleName())
                .build();
    }

    public String authenticate( AuthenticationRequest request){
try {
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );

    var user = repository.findByEmail(request.getEmail()).orElseThrow(
            () -> new IllegalArgumentException("Invalid email or password!")
    )
            ;
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserToken(user, jwtToken);

    return jwtToken;
}catch (Exception ex){
    throw new IllegalArgumentException("Invalid email or password!");
}


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



