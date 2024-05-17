package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.Ads;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdsRepository extends JpaRepository<Ads, Integer> {

    boolean existsByName(String name);
    boolean isActive(boolean isActive);

}
