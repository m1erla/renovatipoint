package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {
    boolean existsByName(String serviceName);

}
