package com.werkspot.entities.concretes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
@Getter
@Setter
@Entity
@Table(name = "user_role")
@JsonIgnoreProperties(ignoreUnknown = true)

public class UserRole implements Serializable {
     private static final long serialVersionUID = 5921348912324124L;

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
     @ManyToOne
     @JoinColumn(name = "user_id", insertable = true, updatable = true)
     private User user;

     @ManyToOne
     @JoinColumn(name = "role_id", insertable = true, updatable = true)
     private Role role;

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the user
     */
    public User getUser() {
        return user;
    }

    /**
     * @param user the user to set
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * @return the role
     */
    public Role getRole() {
        return role;
    }

    /**
     * @param role the role to set
     */
    public void setRole(Role role) {
        this.role = role;
    }
}
