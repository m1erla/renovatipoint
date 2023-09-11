package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface ConsumerRepository extends JpaRepository<Consumer, Integer> {
    boolean existsConsumersByEmail(String email);

    Optional<Consumer> findByEmail(String email);

}
