package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Ads;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdsRepository extends JpaRepository<Ads, Integer> {

    boolean existsByName(String adName);
    boolean isActive(boolean isActive);

}
