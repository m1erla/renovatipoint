package com.werkspot.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import java.util.Arrays;
import java.util.Collections;

import static com.werkspot.entities.concretes.Permission.*;
import static com.werkspot.entities.concretes.Role.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
@EnableWebSocketMessageBroker
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;


//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .authorizeHttpRequests(req ->
//                        req.requestMatchers("/api/v1/auth/**",
//                                "/api/v1/users/**",
//                                "/api/v1/categories/**",
//                                "/api/v1/services/**",
//                                "/api/v1/job_titles/**",
//                                "/api/v1/ads/**",
//                                "/api/v1/images",
//                                "/ws",
//                                "/app",
//                                "/app/ws",
//                                "/app/topic/public",
//                                "/app/topic",
//                                "/chat.sendMessage",
//                                "/v3/api-docs/**",
//                                "/v3/api-docs",
//                                "/v2/api-docs",
//                                "/swagger-resources",
//                                "/swagger-resources/**",
//                                "/configuration/ui",
//                                "/configuration/security",
//                                "/swagger-ui/**",
//                                "/webjars/**",
//                                "/swagger-ui.html"
//                                )
//                                .permitAll()
//                                .anyRequest()
//                                .authenticated()
//                )
//
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//                .logout(logout ->
//                        logout.logoutUrl("/api/v1/auth/logout")
//                                .addLogoutHandler(logoutHandler)
//                                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
//                ).formLogin(Customizer.withDefaults());
//
//        return http.build();
//        }

    private void sharedSecurityConfiguration(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));

        configuration.addAllowedOrigin("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChainGlobalAPI(HttpSecurity http) throws Exception{
        sharedSecurityConfiguration(http);
        http.securityMatcher("/api/v1/users/**",
                "/api/v1/auth/**",
                "/api/v1/categories/**",
                "/api/v1/services/**",
                "/api/v1/job_titles/**",
                "/api/v1/ads/**",
                "/api/v1/images",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/v2/api-docs",
                                "/swagger-resources",
                                "/swagger-resources/**",
                                "/configuration/ui",
                                "/configuration/security",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-ui.html"

        ).authorizeHttpRequests(auth -> {
            auth.anyRequest().permitAll();
        }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();

    }

    @Bean
    public SecurityFilterChain securityFilterChainGlobalAdminAPI(HttpSecurity http) throws Exception{
        sharedSecurityConfiguration(http);
        http.securityMatcher("/api/v1/admin/**").authorizeHttpRequests(auth ->{
            auth.anyRequest()
                    .hasRole("ADMIN");
        }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChainGlobalUserProfileAPI(HttpSecurity http) throws Exception{
        sharedSecurityConfiguration(http);
        http.securityMatcher("/api/v1/users/profile").authorizeHttpRequests(auth ->{
            auth.anyRequest().hasRole("USER");

        }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChainLoginAPI(HttpSecurity httpSecurity) throws Exception {
        sharedSecurityConfiguration(httpSecurity);
        httpSecurity.securityMatcher("/api/v1/auth/authenticated").authorizeHttpRequests(auth -> {
            auth.anyRequest().permitAll();
        }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChainRegisterAPI(HttpSecurity httpSecurity) throws Exception {
        sharedSecurityConfiguration(httpSecurity);
        httpSecurity.securityMatcher("/api/v1/auth/registered").authorizeHttpRequests(auth -> {
            auth.anyRequest().permitAll();
        }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }



}
