package com.werkspot.security.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    @JsonProperty("access-token")
    private String accessToken;

    @JsonProperty("refresh-token")
    private String refreshToken;
}
