package com.werkspot.entities.concretes;

import com.werkspot.security.token.Token;
import com.werkspot.security.user.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "masters")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Builder
public class Master implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    private int experience;

    @Column(name = "job_title")
    private String jobTitleName;

    private String serviceName;

    @Column(name = "email")
    private String email;

    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String postCode;

    private String descriptions;

    @ManyToOne
    @JoinColumn(name = "fk_consumer_id")
    private Consumer consumer;

    @OneToOne
    @JoinColumn(name = "fk_user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "fk_ad_id")
    private Ads ads;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "master")
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
        return true ;
    }
}
