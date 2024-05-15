package com.renovatipoint.business.responses;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegisterResponse {

    String message;
    int userId;
    String email;
}
