package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.Category;
import com.werkspot.entities.concretes.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobTitleRepository extends JpaRepository<JobTitle, Integer> {


    boolean existsByName(String jobTitleName);

    Optional<JobTitle> findByName(String name);



    List<JobTitle> findById(int jobTitleId);
}
