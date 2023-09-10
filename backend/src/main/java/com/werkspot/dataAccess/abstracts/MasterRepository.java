package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Master;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MasterRepository extends JpaRepository<Master, Integer> {
     boolean existsMasterByEmail(String email);

     Optional<Master> findByEmail(String email);

}
