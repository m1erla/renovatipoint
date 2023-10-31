package com.werkspot;

import com.werkspot.core.utilities.exceptions.BusinessException;
import com.werkspot.core.utilities.exceptions.ProblemDetails;
import com.werkspot.core.utilities.exceptions.ValidationProblemDetails;
import com.werkspot.security.auth.AuthenticationRequest;
import com.werkspot.security.auth.AuthenticationService;
import com.werkspot.security.auth.RegisterRequest;
import com.werkspot.security.user.Role;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;

import static com.werkspot.security.user.Role.*;


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
            var admin = RegisterRequest.builder()
                    .build();
            var manager = RegisterRequest.builder()
                    .build();
        };
    }
}
