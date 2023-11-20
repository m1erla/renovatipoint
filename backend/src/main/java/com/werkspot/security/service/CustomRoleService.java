package com.werkspot.security.service;

import com.werkspot.dataAccess.abstracts.RoleRepository;
import com.werkspot.entities.concretes.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomRoleService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomRoleService.class);

    private RoleRepository roleRepository;

    public Role save(Role role){
        return roleRepository.save(role);
    }

    public List<Role> findAllRole(){
        return roleRepository.findAll();
    }

    public Role findDefaultRole(){
        return findAllRole().stream().findFirst().orElse(null);
    }

    public Role findRoleByName(String role){
        return findAllRole().stream().filter(r -> r.getName().equals(role)).findFirst().orElse(null);
    }
}
