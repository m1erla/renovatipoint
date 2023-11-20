package com.werkspot.security.config;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.service.CustomUserService;
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

    private static CustomUserService userService;
    @Autowired
    private SecurityPrincipal(CustomUserService userService){
        this.userService = userService;
    }

    public static SecurityPrincipal getInstance(){
        securityPrincipal = new SecurityPrincipal(userService);
        return securityPrincipal;
    }

    public User getLoggedInPrincipal(){
        if (principal != null){
            UserDetails loggedInPrincipal = (UserDetails)
                    principal.getPrincipal();
            return userService.findByName(loggedInPrincipal.getUsername());
        }
        return null;
    }

    public Collection<?> getLoggedInPrincipalAuthorities(){
        return ((UserDetails) principal.getPrincipal()).getAuthorities();
    }
}
