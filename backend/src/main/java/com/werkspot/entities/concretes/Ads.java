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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_category_id")
    private Category categoryId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_consumer_id")
    private Consumer consumerAd;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_master_id")
    private Master masterAd;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_user_id")
    private User userAd;

    @OneToMany
    @JoinColumn(name = "fk_service_id")
    private List<Employment> serviceId;

    private Date adReleaseDate;

    private String descriptions;

    private boolean isActive;
}
