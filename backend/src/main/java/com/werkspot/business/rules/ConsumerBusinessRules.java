package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.ConsumerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConsumerBusinessRules {

    private ConsumerRepository consumerRepository;

    public void checkIfInfoExists(String email){
        if(this.consumerRepository.existsConsumersByEmail(email)){
            throw new BusinessException("Email or Phone Number is already exists! Please try differ email or phone number!");
        }
    }
}
