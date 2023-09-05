package com.werkspot.security.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    @Query(value = """
      select t from Token t inner join Consumer c\s
      on t.consumer.id = c.id\s
      where c.id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<Token> findAllValidTokenByConsumer(Integer id);

    boolean findByToken(String token);

}
