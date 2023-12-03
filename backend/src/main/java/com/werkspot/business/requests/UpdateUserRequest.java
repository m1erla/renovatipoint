package com.werkspot.business.requests;

import com.werkspot.entities.concretes.Role;
import lombok.*;

import java.util.Optional;

@Data
public class UpdateUserRequest {
    private int id;
    private String name;
    private String surname;
    private String email;
    private Optional<String> password;
    private String phoneNumber;
    private String postCode;
    private String jobTitleName;
    private Role role;

    public UpdateUserRequest(int id, String name, String surname, String email, Optional<String> password, String phoneNumber, String postCode, String jobTitleName, Role role) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.postCode = postCode;
        this.jobTitleName = jobTitleName;
        this.role = role;
    }

    public UpdateUserRequest() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Optional<String> getPassword() {
        return password;
    }

    public void setPassword(Optional<String> password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String getJobTitleName() {
        return jobTitleName;
    }

    public void setJobTitleName(String jobTitleName) {
        this.jobTitleName = jobTitleName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
