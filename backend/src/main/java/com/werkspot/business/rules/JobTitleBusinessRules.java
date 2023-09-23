package com.werkspot.business.rules;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.dataAccess.abstracts.JobTitleRepository;
import com.werkspot.entities.concretes.JobTitle;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;
@AllArgsConstructor
@Service
public class JobTitleBusinessRules {
    private JobTitleRepository jobTitleRepository;

    public void checkIfJobTitleNameExists(String jobTitle){
        if (this.jobTitleRepository.existsByJobTitleName(jobTitle)){
            throw  new BusinessException("The job title is already exist! Please try differ job title name");
        }
    }
}
