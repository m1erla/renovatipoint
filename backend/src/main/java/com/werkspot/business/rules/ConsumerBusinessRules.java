package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.ConsumerRepository;

public class ConsumerBusinessRules {

    private ConsumerRepository consumerRepository;

    public void checkIfInfoExists(String email, String phoneNumber){
        if(this.consumerRepository.existsConsumersByEmail(email) && this.consumerRepository.existsConsumerByPhoneNumber(phoneNumber)){
            throw new BusinessException("Email or Phone Number is already exists! Please try differ email or phone number!");
        }
    }
}
