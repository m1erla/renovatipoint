package com.werkspot.security.service;

import com.werkspot.business.requests.CreateUserRequest;
import com.werkspot.business.responses.GetUsersByIdResponse;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.UserRepository;
import com.werkspot.dataAccess.abstracts.UserRoleRepository;
import com.werkspot.entities.concretes.Role;
import com.werkspot.entities.concretes.User;
import com.werkspot.entities.concretes.UserRole;
import com.werkspot.security.auth.RegisterRequest;
import com.werkspot.security.config.SecurityPrincipal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserService implements UserDetailsService {
    private static final Logger LOG = LoggerFactory.getLogger(CustomUserService.class);

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    CustomRoleService roleService;
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByName(username);
        if (user != null){
            List<UserRole> userRoles = userRoleRepository.findAllByUserId(user.getId());

            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            userRoles.forEach(userRole -> {
                authorities.add(new SimpleGrantedAuthority(userRole.getRole().getName()));
            });

            UserDetails principal = new org.springframework.security.core.userdetails.User(user.getUsername(),
                    user.getPassword(), authorities);
            return principal;
        }
        return null;

    }

    public String createUser(RegisterRequest request){
        try {
            User user = (User) dtoMapperRequestDtoToUser(request);

            user = userRepository.save(user);
            if (!request.getRoleList().isEmpty()){
                for (String role : request.getRoleList()){
                    Role existingRole = roleService.findRoleByName("ROLE_" + role.toUpperCase());
                    if (existingRole != null) {
                        addUserRole(user, existingRole);
                    }
                }
            }else {
                addUserRole(user, null);
            }
            return "User successfully created.";

        }catch (Exception e){
            e.printStackTrace();
            return e.getCause().getMessage();
        }
    }

    public User findByName(String name){
        return userRepository.findByName(name);
    }

    public User findCurrentUser(){
        return userRepository.findById(SecurityPrincipal.getInstance().getLoggedInPrincipal().getId()).get();
    }

    public List<UserRole> findAllCurrentUserRole(){
        return userRoleRepository.findAllByUserId(SecurityPrincipal.getInstance().getLoggedInPrincipal().getId());
    }

    public User updateUser(RegisterRequest userRequestDTO) {

        User user = (User) dtoMapperRequestDtoToUser(userRequestDTO);

        user = userRepository.save(user);
        addUserRole(user, null);

        return user;
    }

    public List<User> retrieveAllUserList(){
        return userRepository.findAll();
    }

    public Optional<User> findUserById(int id){
        return userRepository.findById(id);
    }

    public void addUserRole(User user, Role role){
        UserRole userRole = new UserRole();
        userRole.setUser(user);

        if (role == null){
            role = roleService.findDefaultRole();
        }

        userRole.setRole(role);
        userRoleRepository.save(userRole);
    }
    private Object dtoMapperRequestDtoToUser(RegisterRequest request){
        User target = new User();
        target.setName(request.getName());
        target.setSurname(request.getSurname());
        target.setEmail(request.getEmail());
        target.setJobTitleName(request.getJobTitleName());
        target.setPassword(request.getPassword());
        target.setPostCode(request.getPostCode());
        target.setPhoneNumber(request.getPhoneNumber());
        target.setRole((Role) request.getRoleList());

        return target;
    }
}

