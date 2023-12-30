package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
@Data
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity

public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(unique = true)
    private String name;

    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "ad_id")
    private Ads ad;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Employment> services;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<JobTitle> jobTitles;

    public void addJobTitle(JobTitle jobTitle){
        jobTitles.add(jobTitle);
        jobTitle.setCategory(this);
    }
}
