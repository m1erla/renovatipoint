package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsumerRepository extends JpaRepository<Consumer, Integer> {
    boolean existsConsumersByEmail(String email);

    Optional<Consumer> findByEmail(String email);

}
