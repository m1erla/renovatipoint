package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {



    boolean existsByName(String serviceName);

}
