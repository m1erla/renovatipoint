package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.UserService;
import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.requests.UpdateUserRequest;
import com.werkspot.business.responses.*;
import com.werkspot.business.rules.UserBusinessRules;
import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.AdsRepository;
import com.werkspot.dataAccess.abstracts.ConsumerRepository;
import com.werkspot.dataAccess.abstracts.MasterRepository;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.entities.concretes.Ads;
import com.werkspot.entities.concretes.Consumer;
import com.werkspot.entities.concretes.Master;
import com.werkspot.entities.concretes.User;
import com.werkspot.security.config.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserManager implements UserService {
    private ModelMapperService modelMapperService;
    private UserRepository userRepository;
    private UserBusinessRules userBusinessRules;
    private MasterRepository masterRepository;
    private AdsRepository adsRepository;
    private ConsumerRepository consumerRepository;
    private JwtService jwtService;

    @Override
    public List<GetAllUsersResponse> getAll() {
        List<User> users = userRepository.findAll();

        List<GetAllUsersResponse> usersResponses =
                users.stream().map(user ->
                        this.modelMapperService
                                .forResponse()
                                .map(user, GetAllUsersResponse.class))
                        .collect(Collectors.toList());
        return usersResponses;
    }

    @Override
    public GetAllByIdMastersResponse getMasterById(int id) {
        Master master = this.masterRepository.findById(id).orElseThrow();

        GetAllByIdMastersResponse response =
                this.modelMapperService.forResponse().map(master, GetAllByIdMastersResponse.class);
        return response;
    }

    @Override
    public User findUserProfileByToken(String token) throws BusinessException {
        String email = jwtService.decodeToken(token);

        User user = userRepository.findByEmail(email);

        if (user == null){
            throw new BusinessException("User not found with email " + email);
        }

        return user;
    }


    @Override
    public GetAllByIdConsumersResponse getConsumerById(int id) {
        Consumer consumer = this.consumerRepository.findById(id).orElseThrow();

        GetAllByIdConsumersResponse response =
                this.modelMapperService.forResponse().map(consumer, GetAllByIdConsumersResponse.class);

        return response;
    }

    @Override
    public GetUsersByEmailResponse getByEmail(String email) {
        User user = this.userRepository.findByEmail(email);

        GetUsersByEmailResponse response =
                this.modelMapperService.forResponse().map(user, GetUsersByEmailResponse.class);

        return response;
    }

    @Override
    public GetAdsByIdResponse getAdById(int id) {
        Ads ads = this.adsRepository.findById(id).orElseThrow();

        GetAdsByIdResponse response =
                this.modelMapperService.forResponse().map(ads, GetAdsByIdResponse.class);
        return response;
    }

    @Override
    public List<GetAllAdsResponse> getAllAds() {
        List<Ads> ads = adsRepository.findAll();

        List<GetAllAdsResponse> adsResponses =
                ads.stream().map(ads1 -> this.modelMapperService.forResponse().map(ads1, GetAllAdsResponse.class)).collect(Collectors.toList());

        return adsResponses;
    }

    @Override
    public GetUsersByIdResponse getById(int id) {
        User user = this.userRepository.findById(id).orElseThrow();

        GetUsersByIdResponse response =
                this.modelMapperService.forResponse().map(user, GetUsersByIdResponse.class);
        return response;
    }

    @Override
    public void add(CreateUserRequest createUserRequest) {
       this.userBusinessRules.checkIfEmailExists(createUserRequest.getEmail());
       User user = this.modelMapperService
               .forRequest()
               .map(createUserRequest, User.class);
       this.userRepository.save(user);
    }

    @Override
    public void update(UpdateUserRequest updateUserRequest) {
         User user = this.modelMapperService.forRequest().map(updateUserRequest, User.class);
         this.userRepository.save(user);
    }

    @Override
    public void delete(int id) {
        this.userRepository.deleteById(id);

    }
}
