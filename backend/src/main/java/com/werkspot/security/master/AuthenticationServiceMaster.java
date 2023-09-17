//package com.werkspot.security.master;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.werkspot.dataAccess.abstracts.MasterRepository;
//import com.werkspot.entities.concretes.Master;
//import com.werkspot.security.auth.AuthenticationRequest;
//import com.werkspot.security.auth.AuthenticationResponse;
//import com.werkspot.security.config.JwtService;
//import com.werkspot.security.token.Token;
//import com.werkspot.security.token.TokenRepository;
//import com.werkspot.security.token.TokenType;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpHeaders;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//
//@Service
//@RequiredArgsConstructor
//public class AuthenticationServiceMaster {
//    private final MasterRepository repository;
//    private final TokenRepository tokenRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtService jwtService;
//    private final AuthenticationManager authenticationManager;
//
//    public AuthenticationResponse register(RegisterRequest request){
//        var master = Master.builder()
//                .name(request.getFirstname())
//                .surname(request.getLastname())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(request.getRole())
//                .build();
//        var savedMaster = repository.save(master);
//        var jwtToken = jwtService.generateToken(master);
//        var refreshToken = jwtService.generateRefreshToken(master);
//        saveMasterToken(savedMaster, jwtToken);
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
//        revokeAllMasterTokens(master);
//        saveMasterToken(master, jwtToken);
//        return AuthenticationResponse.builder()
//                .accessToken(jwtToken)
//                .refreshToken(refreshToken)
//                .build();
//
//    }
//    private void saveMasterToken(Master master, String jwtToken){
//        var token = Token.builder()
//                .master(master)
//                .token(jwtToken)
//                .tokenType(TokenType.BEARER)
//                .expired(false)
//                .revoked(false)
//                .build();
//        tokenRepository.save(token);
//    }
//    private void revokeAllMasterTokens( Master master){
//        var validMasterTokens = tokenRepository.findAllValidTokenByMaster(master.getId());
//        if(validMasterTokens.isEmpty())
//            return;
//        validMasterTokens.forEach(token -> {
//            token.setExpired(true);
//            token.setRevoked(true);
//        });
//        tokenRepository.saveAll(validMasterTokens);
//    }
//    public void refreshToken(
//            HttpServletRequest request,
//            HttpServletResponse response
//    ) throws IOException {
//        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//        final String refreshToken;
//        final String masterEmail;
//        if(authHeader == null || !authHeader.startsWith("Bearer ")){
//            return;
//        }
//
//        refreshToken = authHeader.substring(7);
//        masterEmail = jwtService.extractUsername(refreshToken);
//        if(masterEmail != null){
//            var master = this.repository.findByEmail(masterEmail).orElseThrow();
//            if (jwtService.isTokenValid(refreshToken, master)) {
//                var accessToken = jwtService.generateToken(master);
//                revokeAllMasterTokens(master);
//                saveMasterToken(master, accessToken);
//                var authResponse = AuthenticationResponse.builder()
//                        .accessToken(accessToken)
//                        .refreshToken(refreshToken)
//                        .build();
//                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
//            }
//        }
//    }
//}
