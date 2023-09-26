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

    @OneToMany(mappedBy = "categoryId")
    private List<Ads> ads;

    @OneToMany(mappedBy = "categoryId")
    private List<Employment> serviceName;
}
