package com.werkspot.entities.concretes;

import com.werkspot.security.token.Token;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "consumers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Data
public class Consumer implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;
    @Email
    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "post_code")
    private String postCode;

    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", insertable = true, updatable = true)
    private Role role;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "consumer", cascade = CascadeType.DETACH)
    private List<Ads> ads;

    @OneToMany(mappedBy = "consumer")
    private List<Master> masters;


    @OneToMany(mappedBy = "consumer")
    private List<Token> token;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getAuthorities();
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
