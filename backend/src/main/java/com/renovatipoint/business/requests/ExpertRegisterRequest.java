package com.renovatipoint.business.requests;

import com.renovatipoint.entities.concretes.JobTitle;
import com.renovatipoint.entities.concretes.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExpertRegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String surname;
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    @NotBlank(message = "Job title is required")
    private String jobTitleName;

    private String jobTitleId;
    @NotBlank(message = "Post code is required")
    private String postCode;
    private String phoneNumber;
    private String address;
    private Role role;


}
