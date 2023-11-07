package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {



    boolean existsByName(String categoryName);

    Optional<Category> findByName(String categoryName);

    Optional<JobTitle> findById(Optional<Integer> categoryId);

    List<Category> findAllByJobTitles_Id(int jobTitleId);
}
