package com.werkspot.security.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.werkspot.dataAccess.abstracts.ConsumerRepository;
import com.werkspot.entities.concretes.Consumer;
import com.werkspot.security.auth.AuthenticationRequest;
import com.werkspot.security.auth.AuthenticationResponse;
import com.werkspot.security.config.JwtService;
import com.werkspot.security.token.Token;
import com.werkspot.security.token.TokenRepository;
import com.werkspot.security.token.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

//@Service
//@RequiredArgsConstructor
public class AuthenticationServiceConsumer {
//      private final ConsumerRepository repository;
//      private final TokenRepository tokenRepository;
//      private final PasswordEncoder passwordEncoder;
//      private final JwtService jwtService;
//      private final AuthenticationManager authenticationManager;
//
//    public AuthenticationResponse register(RegisterRequest request){
//        var consumer = Consumer.builder()
//                .name(request.getFirstname())
//                .surname(request.getLastname())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(request.getRole())
//                .build();
//        var savedConsumer = repository.save(consumer);
//        var jwtToken = jwtService.generateToken(consumer);
//        var refreshToken = jwtService.generateRefreshToken(consumer);
//        saveConsumerToken(savedConsumer, jwtToken);
//        return AuthenticationResponse.builder()
//                .accessToken(jwtToken)
//                .refreshToken(refreshToken)
//                .build();
//    }
//
//    public AuthenticationResponse authenticate( AuthenticationRequest request){
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getEmail(),
//                        request.getPassword()
//                )
//        );
//        var master = repository.findByEmail(request.getEmail())
//                .orElseThrow();
//        var jwtToken = jwtService.generateToken(master);
//        var refreshToken = jwtService.generateRefreshToken(master);
//        revokeAllConsumerTokens(master);
//        saveConsumerToken(master, jwtToken);
//        return AuthenticationResponse.builder()
//                .accessToken(jwtToken)
//                .refreshToken(refreshToken)
//                .build();
//
//    }
//    private void saveConsumerToken(Consumer consumer, String jwtToken){
//        var token = Token.builder()
//                .consumer(consumer)
//                .token(jwtToken)
//                .tokenType(TokenType.BEARER)
//                .expired(false)
//                .revoked(false)
//                .build();
//        tokenRepository.save(token);
//    }
//    private void revokeAllConsumerTokens( Consumer consumer){
//        var validConsumerTokens = tokenRepository.findAllValidTokenByConsumer(consumer.getId());
//        if(validConsumerTokens.isEmpty())
//            return;
//        validConsumerTokens.forEach(token -> {
//            token.setExpired(true);
//            token.setRevoked(true);
//        });
//        tokenRepository.saveAll(validConsumerTokens);
//    }
//    public void refreshToken(
//            HttpServletRequest request,
//            HttpServletResponse response
//    ) throws IOException {
//        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//        final String refreshToken;
//        final String consumerEmail;
//        if(authHeader == null || !authHeader.startsWith("Bearer ")){
//            return;
//        }
//
//        refreshToken = authHeader.substring(7);
//        consumerEmail = jwtService.extractUsername(refreshToken);
//        if(consumerEmail != null){
//            var consumer = this.repository.findByEmail(consumerEmail).orElseThrow();
//            if (jwtService.isTokenValid(refreshToken, consumer)) {
//                var accessToken = jwtService.generateToken(consumer);
//                revokeAllConsumerTokens(consumer);
//                saveConsumerToken(consumer, accessToken);
//                var authResponse = AuthenticationResponse.builder()
//                        .accessToken(accessToken)
//                        .refreshToken(refreshToken)
//                        .build();
//                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
//            }
//        }
//    }

}
