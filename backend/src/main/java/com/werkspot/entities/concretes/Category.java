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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_ad_id")
    private Ads ads;

    @OneToMany
    @JoinColumn(name = "fk_service_id")
    private List<Employment> services;
}
