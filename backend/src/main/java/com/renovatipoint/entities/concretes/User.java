package com.renovatipoint.entities.concretes;

import com.renovatipoint.security.token.Token;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Getter
    @Column(name = "name")
    private String name;

    @Getter
    @Column(name = "surname")
    private String surname;

    @Email
    @Column(name = "email", unique = true)
    private String email;

    private String password;

    @Column(name = "job_title_name")
    private String jobTitleName;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    private String postCode;

    @OneToMany(mappedBy = "user", cascade = CascadeType.PERSIST)
    private List<Ads> ads;

    @Enumerated(EnumType.STRING)
    private Role role;


    @OneToMany(mappedBy = "user")
    private List<JobTitle> jobTitles;


    @OneToMany(mappedBy = "user")
    private List<Token> token;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
