package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StorageRepository extends JpaRepository<Image, Integer> {

    Optional<Image> findByName(String fileName);


}
