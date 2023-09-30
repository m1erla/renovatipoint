package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {



    boolean existsByName(String categoryName);

}
