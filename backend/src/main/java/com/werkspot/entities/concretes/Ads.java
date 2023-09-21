package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "ads")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
public class Ads {
    @Id
    @GeneratedValue
    private int id;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "category_id")
    private Category categoryId;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "consumer_id")
    private Consumer consumerAd;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "master_id")
    private Master masterAd;

    @OneToMany(mappedBy = "ads")
    @JoinColumn(name = "service_id")
    private List<Employment> serviceId;

    private String adReleaseDate;

    private String description;

    private boolean isActive;
}
