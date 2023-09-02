package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Master;
import org.springframework.data.jpa.repository.JpaRepository;



public interface MasterRepository extends JpaRepository<Master, Integer> {
     boolean existsMasterByEmail(String email);


}
