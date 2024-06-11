package com.renovatipoint.entities.concretes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    private ServiceEntity service;


    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;


    @OneToMany(mappedBy = "ads", cascade = CascadeType.PERSIST)
    private List<Image> images = new ArrayList<>();




    //    @Column(name = "ad_release_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
//    @CreatedDate
//    @CreationTimestamp
//    @Temporal(TemporalType.TIMESTAMP)
    private String adReleaseDate;

    private String descriptions;
    private String imageUrl;

    private boolean isActive;
}
