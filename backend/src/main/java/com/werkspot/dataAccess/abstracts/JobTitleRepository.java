package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobTitleRepository extends JpaRepository<JobTitle, Integer> {


    boolean existsByJobTitleName(String jobTitleName);

    Optional<JobTitle> findByJobTitleName(String name);
}
