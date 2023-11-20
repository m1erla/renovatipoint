package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Enum> {
}
