package com.werkspot.security.service;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.Role;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.config.SecurityPrincipal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserService implements UserDetailsService {
    private static final Logger LOG = LoggerFactory.getLogger(CustomUserService.class);

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public User findByName(String name){
        return userRepository.findByName(name);
    }

    public User findCurrentUser(){
        return userRepository.findById(SecurityPrincipal.getInstance().getLoggedInPrincipal().getId()).get();
    }

    private Object dtoMapperRequestDtoToUser(CreateUserRequest request){
        User target = new User();
        target.setName(request.getName());
        target.setSurname(request.getSurname());
        target.setEmail(request.getEmail());
        target.setJobTitleName(request.getJobTitleName());
        target.setPassword(request.getPassword());
        target.setPostCode(request.getPostCode());
        target.setPhoneNumber(request.getPhoneNumber());
        target.setRole(request.getRole());

        return target;
    }
}

