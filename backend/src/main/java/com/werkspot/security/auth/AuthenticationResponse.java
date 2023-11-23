package com.werkspot.security.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
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

     public AuthenticationResponse() {
     }

     public AuthenticationResponse(String accessToken, String refreshToken, String name, String surname, String postCode, String phoneNumber, String jobTitleName, String message, int userId, String email) {
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
          this.name = name;
          this.surname = surname;
          this.postCode = postCode;
          this.phoneNumber = phoneNumber;
          this.jobTitleName = jobTitleName;
          this.message = message;
          this.userId = userId;
          this.email = email;
     }
}
