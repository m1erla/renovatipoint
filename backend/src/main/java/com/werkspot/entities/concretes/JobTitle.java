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

    @Column(name = "job_title_name")
    private String jobTitleName;

    @Column(name = "descriptions")
    private String descriptions;


    @OneToMany
    @JoinColumn(name = "fk_service_id")
    private List<Employment> services;

    @ManyToOne
    @JoinColumn(name = "fk_master_id")
    private Master master;
}
