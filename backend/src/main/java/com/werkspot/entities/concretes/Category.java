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
    @GeneratedValue
    private int id;


    private String categoryName;

    private boolean isActive;
    @OneToOne(mappedBy = "categories")
    @JoinColumn(name = "ad_id")
    private Ads ads;

    @OneToMany(mappedBy = "categories")
    @JoinColumn(name = "services")
    private List<Employment> services;
}
