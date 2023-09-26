package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ad_name")
    private String adName;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_category_id")
    private Category categoryId;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_master_id")
    private Master masterId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_user_id")
    private User userId;

    @OneToMany(mappedBy = "ads")
    private List<Employment> serviceId;


    private String adReleaseDate;

    private String descriptions;

    private boolean isActive;
}
