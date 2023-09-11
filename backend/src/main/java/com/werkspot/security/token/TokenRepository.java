package com.werkspot.security.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    @Query(value = """
      select t from Token t inner join User u\s
      on t.user.id = u.id\s
      where u.id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<Token> findAllValidTokenByUser(Integer id);

    @Query(value = """
      select t from Token t inner join Consumer c\s
      on t.consumer.id = c.id\s
      where c.id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<Token> findAllValidTokenByConsumer(Integer id);

    @Query(value = """
      select t from Token t inner join Master m\s
      on t.master.id = m.id\s
      where m.id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<Token> findAllValidTokenByMaster(Integer id);

    Optional<Token> findByToken(String token);

}
