package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.*;
@Data
@Table(name = "image_data")
@Entity
@Getter
@Setter
@Builder
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    public Image(int id, String name, String type, byte[] imageData, String url) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.imageData = imageData;
        this.url = url;
    }

    public Image(){}

    private String type;
    @Lob
    @Column(name = "image_data", length = 1000)
    private byte[] imageData;

    private String url;
}
