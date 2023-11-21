package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.JobTitle;
import com.werkspot.entities.concretes.Master;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterRepository extends JpaRepository<Master, Integer> {
     boolean existsMasterByEmail(String email);

}
