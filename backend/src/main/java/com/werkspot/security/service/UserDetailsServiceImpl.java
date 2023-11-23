package com.werkspot.security.service;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.auth.RegisterRequest;
import com.werkspot.security.config.SecurityPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger LOG = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    public UserDetailsServiceImpl(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    private final UserRepository userRepository;
    private final UserService userService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(username);

        if (user.isEmpty()){
            throw new UsernameNotFoundException("User not found with this email - " + username);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        return new org.springframework.security.core.userdetails.User(findCurrentUser().getEmail(), findCurrentUser().getPassword(), authorities);

    }

    public User findCurrentUser(){
        return userRepository.findById(SecurityPrincipal.getInstance().getLoggedInPrincipal().getId()).get();
    }

    private Object dtoMapperRequestDtoToUser(RegisterRequest request){
        User target = new User();
        target.setName(request.getName());
        target.setSurname(request.getSurname());
        target.setEmail(request.getEmail());
        target.setJobTitleName(request.getJobTitleName());
        target.setPassword(request.getPassword());
        target.setPostCode(request.getPostCode());
        target.setPhoneNumber(request.getPhoneNumber());

        return target;
    }
}

