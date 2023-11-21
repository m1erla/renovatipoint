package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;
@Data
@Table(name = "image_data")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String type;
    @Lob
    @Column(name = "image_data", length = 1000)
    private byte[] imageData;

    private String url;
}
