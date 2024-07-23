package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.Storage;
import com.renovatipoint.entities.concretes.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StorageRepository extends JpaRepository<Storage, Integer> {

    Optional<Storage> findByName(String name);

    List<Storage> findByUserAndName(User user, String name);

    Optional<Storage> findById(int id);

    void deleteByName(String name);






}
