package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Ads;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdsRepository extends JpaRepository<Ads, Integer> {

    Optional<Ads> findAdsByName(String adsName);

    boolean existsByName(String adsName);
    boolean existsByAd(boolean isActive);

    Optional<Ads> findAllByAds(String adsName);
}
