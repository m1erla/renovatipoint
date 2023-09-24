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

    @Column(name = "job_title_name", nullable = false, unique = true)
    private String jobTitleName;

    @Column(name = "descriptions")
    private String descriptions;


    @OneToMany(mappedBy = "jobTitle")
    private List<Employment> serviceId;

    @ManyToOne
    @JoinColumn(name = "fk_master_id")
    private Master master;
}
