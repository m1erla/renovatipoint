package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.User;
import com.werkspot.security.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findUserByNameAndPassword(String name, String password);

    User findByName(String name);
    Optional<User> findByEmail(String email);

    List<User> findAllById(int id);

    boolean existsByEmail(String email);

}
