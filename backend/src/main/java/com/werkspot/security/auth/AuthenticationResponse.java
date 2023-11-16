package com.werkspot.security.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
     @JsonProperty("access-token")
     private String accessToken;

     @JsonProperty("refresh-token")
     private String refreshToken;
     String name;
     String surname;
     String postCode;
     String phoneNumber;
     String jobTitleName;
     String message;
     int userId;
     String email;
}
