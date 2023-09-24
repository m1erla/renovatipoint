package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Ads;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdsRepository extends JpaRepository<Ads, Integer> {

    boolean existsByAdName(String adsName);
    boolean isActive(boolean isActive);

}
