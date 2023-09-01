package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;




public interface ConsumerRepository extends JpaRepository<Consumer, Integer> {
    boolean existsConsumersByEmail(String email);


}
