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
            var user = RegisterRequest.builder()
                    .name("User")
                    .surname("User")
                    .email("user@mail.com")
                    .password("password")
                    .phoneNumber("05334332233")
                    .jobTitleName("Software Developer")
                    .postCode("4002")
                    .role(Role.USER)
                    .build();
            System.out.println("User token: " + service.register(user).getAccessToken());

            var admin = RegisterRequest.builder()
                    .name("Admin")
                    .surname("Admin")
                    .email("admin@mail.com")
                    .password("password")
                    .phoneNumber("05334332233")
                    .jobTitleName("Admin")
                    .postCode("5433")
                    .role(ADMIN)
                    .build();
            System.out.println("Admin token: " + service.register(admin).getAccessToken());

            var manager = RegisterRequest.builder()
                    .name("Admin")
                    .surname("Admin")
                    .email("manager@mail.com")
                    .password("password")
                    .phoneNumber("05334332233")
                    .jobTitleName("Manager")
                    .postCode("7894")
                    .role(MANAGER)
                    .build();
            System.out.println("Manager token: " + service.register(manager).getAccessToken());
        };
    }
}
