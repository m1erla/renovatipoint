package com.werkspot.security.auth;

import lombok.*;

import java.io.Serial;
import java.io.Serializable;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = -8091879091924046844L;

    private String token;
}
