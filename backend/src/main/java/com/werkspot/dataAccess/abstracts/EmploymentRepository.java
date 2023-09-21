package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Employment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmploymentRepository extends JpaRepository<Employment, Integer> {

    Optional<Employment> findAllByServicesList(String servicesList);

    boolean existsByServiceName(String serviceName);
    Optional<Employment> findByServiceName(String serviceName);
}
