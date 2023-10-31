package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserBusinessRules {

    private UserRepository userRepository;

    public void checkIfEmailExists(String email){
        if (userRepository.existsByEmail(email)){
            throw new BusinessException("This email is already exists!");
        }
    }

    public boolean userExists(String email){
        return userRepository.existsByEmail(email);
    }
}
