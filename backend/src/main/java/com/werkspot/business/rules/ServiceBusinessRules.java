package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.ServiceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ServiceBusinessRules {
    private ServiceRepository serviceRepository;

    public void checkIfServiceExists(String serviceName){
        if (serviceRepository.existsByName(serviceName)){
            throw new BusinessException("This service name is already exist! Please try different name");
        }
    }
}
