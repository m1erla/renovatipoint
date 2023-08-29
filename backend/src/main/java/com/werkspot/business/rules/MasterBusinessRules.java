package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.MasterRepository;

public class MasterBusinessRules {
    private MasterRepository masterRepository;
    public void checkIfInfoExists(String email){
        if (this.masterRepository.existsMasterByEmail(email)) {
           throw new BusinessException("Email or Phone Number is Already Exist! Please try differ email or phone number!");
        }
        }
    }

