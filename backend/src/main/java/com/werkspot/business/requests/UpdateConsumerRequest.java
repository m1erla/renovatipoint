package com.werkspot.business.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateConsumerRequest {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;

}
