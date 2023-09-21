package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.EmploymentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmploymentBusinessRules {
    private EmploymentRepository employmentRepository;

    public void checkIfServiceExists(String serviceName){
        if (employmentRepository.existsByServiceName(serviceName)){
            throw new BusinessException("This service name is already exist! Please try different name");
        }
    }
}
