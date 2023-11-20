package com.werkspot.security.auth;

import com.werkspot.entities.concretes.Role;
import jakarta.websocket.server.ServerEndpoint;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
    private String phoneNumber;
    private String jobTitleName;
    private String postCode;
    private List<String> roleList = new ArrayList<>();
}
