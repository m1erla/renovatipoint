package com.renovatipoint.business.requests;

import com.renovatipoint.entities.concretes.PaymentInfo;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateExpertRequest {
    private String name;
    private String surname;
    private String email;
    private String companyName;
    private String chamberOfCommerceNumber;
    private String address;
    private String phoneNumber;
    private String postCode;
    private PaymentInfo paymentInfo;
    private MultipartFile storages;
}
