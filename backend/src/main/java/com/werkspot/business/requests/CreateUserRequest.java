package com.werkspot.business.requests;

import com.werkspot.entities.concretes.Role;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateUserRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
    private String phoneNumber;
    private String postCode;
    private String jobTitleName;
    private Role role;

}
