package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StorageRepository extends JpaRepository<Storage, Integer> {

    Optional<Storage> findByName(String fileName);

    Optional<Storage> findById(int id);

    void deleteByName(String fileName);






}
