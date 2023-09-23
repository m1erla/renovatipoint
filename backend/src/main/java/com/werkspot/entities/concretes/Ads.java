package com.werkspot.entities.concretes;

import com.werkspot.security.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
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

    @Column(name = "ad_name")
    private String adName;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "category_id")
    private Category categoryId;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "consumers_id")
    private Consumer consumerAd;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "masters_id")
    private Master masterAd;

    @OneToOne(mappedBy = "ads")
    @JoinColumn(name = "_user_id")
    private User userAd;

    @OneToMany(mappedBy = "ads")
    @JoinColumn(name = "services_id")
    private List<Employment> serviceId;

    private Date adReleaseDate;

    private String descriptions;

    private boolean isActive;
}
