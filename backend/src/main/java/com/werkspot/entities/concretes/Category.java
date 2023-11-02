package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(unique = true)
    private String name;

    private boolean isActive;

    @OneToOne(mappedBy = "category")
    private Ads ad;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employment> services;

    @OneToMany(mappedBy = "category")
    private List<JobTitle> jobTitles;

    public void addJobTitle(JobTitle jobTitle){
        jobTitles.add(jobTitle);
        jobTitle.setCategory(this);
    }
}
