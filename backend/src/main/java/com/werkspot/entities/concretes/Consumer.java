package com.werkspot.entities.concretes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Table(name = "consumers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Consumer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "email")
    private String email;
    @Column(name = "phone_number")
    private String phone_number;

    @OneToMany(mappedBy = "master")
    private List<Master> masters;
}
