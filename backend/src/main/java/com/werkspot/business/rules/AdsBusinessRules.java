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
        if (adsRepository.existsByAdsName(adsName)){
            throw new BusinessException("This ad is already exists! please try different ad name.");
        }
    }

    public void checkIfAdsActive(boolean isActive){
        if (adsRepository.isActive(isActive)){
            throw new BusinessException("There is no ad here!");
        }
    }

    public void checkIfAdsExists(int id, String adsName){
        if (adsRepository.existsById(id) && adsRepository.existsByAdsName(adsName)){
            throw new BusinessException("This ad is already exists! Please try to create another ad.");
        }
    }

}
