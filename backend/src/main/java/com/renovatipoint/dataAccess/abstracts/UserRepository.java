package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findUserByNameAndPassword(String name, String password);

    Optional<User> findByEmail(String email);

    Optional<User> findById(int id);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
    boolean existsByPassword(String password);

}
