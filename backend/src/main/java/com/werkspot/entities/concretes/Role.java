package com.werkspot.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.werkspot.entities.concretes.Permission.*;


@Entity
@Table(name = "Role")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Role implements Serializable {

    @Serial
    private static final long serialVersionUID = 5123124124512414254L;
    @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(name = "name", nullable = false)
    private String name;






}
