package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StorageRepository extends JpaRepository<Image, Integer> {

    Optional<Image> findByName(String fileName);


}
