package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Ads;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdsRepository extends JpaRepository<Ads, Integer> {

    boolean existsByAdsName(String adsName);
    boolean isActive(boolean isActive);

}
