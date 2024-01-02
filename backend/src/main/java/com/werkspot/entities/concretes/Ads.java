package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    private Service service;

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
