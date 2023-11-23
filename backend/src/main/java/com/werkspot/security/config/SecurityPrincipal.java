package com.werkspot.security.config;

import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class SecurityPrincipal {
    private static SecurityPrincipal securityPrincipal = null;

    private Authentication principal = SecurityContextHolder.getContext().getAuthentication();

    private static UserDetailsServiceImpl userService;

    private static UserRepository userRepository;
    @Autowired
    private SecurityPrincipal(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public static SecurityPrincipal getInstance(){
        securityPrincipal = new SecurityPrincipal(userRepository);
        return securityPrincipal;
    }

    public User getLoggedInPrincipal(){
        if (principal != null){
            User loggedInPrincipal = (User)
                    principal.getPrincipal();
            return userRepository.findByName(loggedInPrincipal.getUsername());
        }
        return null;
    }

    public Collection<?> getLoggedInPrincipalAuthorities(){
        return ((UserDetails) principal.getPrincipal()).getAuthorities();
    }
}
