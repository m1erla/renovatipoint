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


    private String categoryName;

    private boolean isActive;

    @OneToMany(mappedBy = "category")
    private List<Ads> ads;

    @OneToMany(mappedBy = "category")
    private List<Employment> serviceName;
}
