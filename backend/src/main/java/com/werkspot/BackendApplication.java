package com.werkspot;

import com.werkspot.security.auth.AuthenticationService;
import com.werkspot.security.auth.RegisterRequest;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.crypto.SecretKey;
import java.util.Base64;


@RestControllerAdvice
@OpenAPIDefinition
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(
            AuthenticationService service
    ) {
        return args -> {
//            SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//            System.out.println("The secret key is : " + key);
//            System.out.println(Base64.getEncoder().encodeToString(key.getEncoded()));
            var admin = RegisterRequest.builder()
                    .build();
            var manager = RegisterRequest.builder()
                    .build();
        };
    }
}
