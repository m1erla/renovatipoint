package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "job_title")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
public class JobTitle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "job_titles")
    private String jobTitles;

    private String name;

    @Column(name = "descriptions")
    private String descriptions;

    @Column(name = "services")
    @OneToMany(mappedBy = "job_titles")
    @JoinColumn(name = "services")
    private List<Employment> services;

    @ManyToOne
    @JoinColumn(name = "master_id")
    private Master master;
}
