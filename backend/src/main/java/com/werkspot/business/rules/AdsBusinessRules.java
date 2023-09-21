package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdsBusinessRules {
    private AdsRepository adsRepository;

    public void checkIfAdsNameExists(String adsName){
        if (adsRepository.existsByName(adsName)){
            throw new BusinessException("This ad is already exists! please try different ad name.");
        }
    }

    public void checkIfAdsExists(boolean isActive){
        if (adsRepository.existsByAd(isActive)){
            throw new BusinessException("This ad is already exists! Please create another ad.");
        }
    }

}
