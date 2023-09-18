package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.JobTitleRepository;
import com.werkspot.dataAccess.abstracts.MasterRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class MasterBusinessRules {

    private MasterRepository masterRepository;

    public void checkIfInfoExists(String email){
        if (this.masterRepository.existsMasterByEmail(email)) {
           throw new BusinessException("Email or Phone Number is Already Exist! Please try differ email or phone number!");
        }
        }

    }

