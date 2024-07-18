package com.renovatipoint.business.requests;

import com.renovatipoint.entities.concretes.Role;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;


@Data
public class UpdateUserRequest {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private MultipartFile storages;
    private String postCode;
    private String jobTitleName;
    private Role role;

    public UpdateUserRequest(int id, String name, String surname, String email, String phoneNumber, MultipartFile storages, String postCode, String jobTitleName, Role role) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.storages = storages;
        this.postCode = postCode;
        this.jobTitleName = jobTitleName;
        this.role = role;
    }

    public UpdateUserRequest(){}

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setStorages(MultipartFile storages) {
        this.storages = storages;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public void setJobTitleName(String jobTitleName) {
        this.jobTitleName = jobTitleName;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public MultipartFile getStorages() {
        return storages;
    }

    public String getPostCode() {
        return postCode;
    }

    public String getJobTitleName() {
        return jobTitleName;
    }

    public Role getRole() {
        return role;
    }
}
