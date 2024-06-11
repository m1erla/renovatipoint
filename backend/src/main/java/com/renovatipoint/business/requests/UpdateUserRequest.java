package com.renovatipoint.business.requests;

import com.renovatipoint.entities.concretes.Image;
import com.renovatipoint.entities.concretes.Role;
import lombok.Data;



@Data
public class UpdateUserRequest {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String profileImage;
    private String postCode;
    private String jobTitleName;
    private Image image;
    private Role role;

    public UpdateUserRequest(int id, String name, String surname, String email, String phoneNumber, String profileImage, String postCode, String jobTitleName, Role role, Image image) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.profileImage = profileImage;
        this.phoneNumber = phoneNumber;
        this.postCode = postCode;
        this.jobTitleName = jobTitleName;
        this.role = role;
        this.image = image;
    }

    public UpdateUserRequest() {
    }

    public String getProfileImage(){
        return profileImage;
    }
    public void setProfileImage(String profileIMage){
        this.profileImage = profileIMage;
    }

    public int getId() {
        return id;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
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
