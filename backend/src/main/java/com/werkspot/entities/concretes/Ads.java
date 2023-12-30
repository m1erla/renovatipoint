package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@Table(name = "ads")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity

public class Ads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "categories", joinColumns = {
            @JoinColumn(name = "ad_id", referencedColumnName = "id")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "category_id", referencedColumnName = "id")
    }
    )
    private Set<Category> categories;
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "services", joinColumns = {
            @JoinColumn(name = "ad_id", referencedColumnName = "id")
    },
            inverseJoinColumns = {
                    @JoinColumn(name = "service_id", referencedColumnName = "id")
            }
    )
    private Set<Employment> services;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;




//    @Column(name = "ad_release_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
//    @CreatedDate
//    @CreationTimestamp
//    @Temporal(TemporalType.TIMESTAMP)
    private String adReleaseDate;

    private String descriptions;

    private boolean isActive;
}
