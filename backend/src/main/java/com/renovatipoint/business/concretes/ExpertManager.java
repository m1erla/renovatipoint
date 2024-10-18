package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.ExpertService;
import com.renovatipoint.business.responses.GetExpertResponse;
import com.renovatipoint.business.responses.GetUsersResponse;
import com.renovatipoint.core.utilities.mappers.ModelMapperService;
import com.renovatipoint.dataAccess.abstracts.ExpertRepository;
import com.renovatipoint.entities.concretes.Expert;
import com.renovatipoint.entities.concretes.User;
import com.renovatipoint.security.token.TokenRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ExpertManager implements ExpertService {
    private final ExpertRepository expertRepository;
    private static final Logger logger = LoggerFactory.getLogger(ExpertManager.class);
    private final ModelMapperService modelMapperService;



    public ExpertManager(ExpertRepository expertRepository, ModelMapperService modelMapperService) {
        this.expertRepository = expertRepository;
        this.modelMapperService = modelMapperService;

    }

    @Override
    public GetExpertResponse getExpertById(String expertId) {
        Expert expert = this.expertRepository.findById(expertId).orElseThrow();

        return this.modelMapperService.forResponse().map(expert, GetExpertResponse.class);
    }

    @Override
    public Expert getById(String expertId) {
        Expert expert = this.expertRepository.findById(expertId)
                .orElseThrow(() -> new EntityNotFoundException("Expert not found"));
        return this.modelMapperService.forResponse().map(expert, Expert.class);
    }

    @Override
    public GetExpertResponse getByEmail(String email) {
        return null;
    }


}
