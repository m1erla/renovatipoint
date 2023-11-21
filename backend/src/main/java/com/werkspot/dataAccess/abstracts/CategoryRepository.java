package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {



    boolean existsByName(String categoryName);

    Optional<Category> findByName(String categoryName);

}
