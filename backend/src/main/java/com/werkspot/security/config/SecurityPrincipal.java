package com.werkspot.security.config;

import com.werkspot.business.concretes.UserManager;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class SecurityPrincipal {
    private static SecurityPrincipal securityPrincipal = null;

    private Authentication principal = SecurityContextHolder.getContext().getAuthentication();

    private static UserManager userService;

    private static UserRepository userRepository;
    @Autowired
    private SecurityPrincipal(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public static SecurityPrincipal getInstance(){
        securityPrincipal = new SecurityPrincipal(userRepository);
        return securityPrincipal;
    }

    public Optional<User> getLoggedInPrincipal() {
        Authentication principal = SecurityContextHolder.getContext().getAuthentication();

        if (principal != null && principal.isAuthenticated()) {
            User loggedInPrincipal = (User) principal.getPrincipal();
            return userRepository.findByEmail(loggedInPrincipal.getUsername());
        }

        return Optional.empty();  // Return an empty Optional
    }


    public Collection<?> getLoggedInPrincipalAuthorities(){
        return ((UserDetails) principal.getPrincipal()).getAuthorities();
    }
}
