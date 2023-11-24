package com.werkspot.security.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
     @JsonProperty("access-token")
     String accessToken;

     @JsonProperty("refresh-token")
     String refreshToken;
     String name;
     String surname;
     String postCode;
     String phoneNumber;
     String jobTitleName;
     String message;
     int userId;
     String email;

     public AuthenticationResponse(String accessToken) {
          this.accessToken = accessToken;
     }
}
