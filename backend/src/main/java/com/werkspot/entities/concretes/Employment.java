package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "services")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
public class Employment {
    @Id
    @GeneratedValue
    private int id;

    private String serviceName;

    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "fk_category_id")
    private Category categoryId;

    @ManyToOne
    @JoinColumn(name = "fk_ad_id")
    private Ads ads;
}
