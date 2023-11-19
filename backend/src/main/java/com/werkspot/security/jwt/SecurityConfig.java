package com.werkspot.security.jwt;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.WebSecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.sql.DataSource;

import static com.werkspot.security.user.Permission.*;
import static com.werkspot.security.user.Permission.MANAGER_DELETE;
import static com.werkspot.security.user.Role.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.http.HttpMethod.DELETE;

//@Configuration
//@EnableWebSecurity
public class SecurityConfig   {

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
//        http.authorizeHttpRequests((authz) -> authz.anyRequest().authenticated()).httpBasic(Customizer.withDefaults());
//        return http.build();
//    }
//
//    @Bean
//    public DataSource dataSource() {
//        return new EmbeddedDatabaseBuilder()
//                .setType(EmbeddedDatabaseType.H2)
//                .addScript(JdbcDaoImpl.DEFAULT_USER_SCHEMA_DDL_LOCATION)
//                .build();
//    }
//
//    @Bean
//    public UserDetailsManager users(DataSource dataSource){
//        UserDetails user = User.withDefaultPasswordEncoder()
//                .username("user")
//                .password("password")
//                .roles("USER")
//                .build();
//        JdbcUserDetailsManager users = new JdbcUserDetailsManager(dataSource);
//        users.createUser(user);
//        return users;
//    }

// http
//         .csrf().disable()
//                .authorizeRequests()
//                .antMatchers(HttpMethod.GET, "/api/v1/users/profile").permitAll()
//                .antMatchers(HttpMethod.GET,"/api/v1/auth/confirmLogin").permitAll()
//                .antMatchers(
//                        "/api/v1/**",
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
//    ).authenticated()
//                .antMatchers("/api/v1/users/**").hasAnyRole(USER.name())
//            .antMatchers("/api/v1/management/**").hasAnyRole(ADMIN.name(), MANAGER.name())
//            .antMatchers(HttpMethod.GET, "/api/v1/management/**").hasAnyAuthority(ADMIN_READ.name(), MANAGER_READ.name())
//            .antMatchers(HttpMethod.POST, "/api/v1/management/**").hasAnyAuthority(ADMIN_CREATE.name(), MANAGER_CREATE.name())
//            .antMatchers(HttpMethod.PUT, "/api/v1/management/**").hasAnyAuthority(ADMIN_UPDATE.name(), MANAGER_UPDATE.name())
//            .antMatchers(HttpMethod.DELETE, "/api/v1/management/**").hasAnyAuthority(ADMIN_DELETE.name(), MANAGER_DELETE.name())
//            .anyRequest().authenticated()
//                .and()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//                .logout()
//                .logoutUrl("/api/v1/auth/logout")
//                .addLogoutHandler(logoutHandler)
//                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
//            .permitAll()
//                .and()
//                .httpBasic().and()
//                .formLogin().withDefaults();
//
//        return http.build();
}
