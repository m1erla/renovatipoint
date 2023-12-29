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

    @ManyToOne()
    @JoinColumn(name = "category_id")
    private Category category;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Employment service;


//    @Column(name = "ad_release_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
//    @CreatedDate
//    @CreationTimestamp
//    @Temporal(TemporalType.TIMESTAMP)
    private String adReleaseDate;

    private String descriptions;

    private boolean isActive;
}
