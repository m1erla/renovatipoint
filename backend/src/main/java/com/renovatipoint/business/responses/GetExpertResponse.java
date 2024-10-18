package com.renovatipoint.business.responses;

import lombok.*;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GetExpertResponse {
    private String id;
    private String name;
    private String surname;
    private String phoneNumber;
    private String address;
    private String email;
    private String postCode;
    private String jobTitleName;
    private String role;
    private GetPaymentInfoResponse paymentInfo;
}
