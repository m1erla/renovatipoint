package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "master_id")
    private Master master;
}
