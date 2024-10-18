package com.renovatipoint.business.responses;

import lombok.*;

import java.math.BigDecimal;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetRequestsResponse {

    private String id;
    private String expertName;
    private String expertEmail;
    private String expertId;
    private String userId;
    private String userName;
    private String adName;
    private String status;
    private String message;
}
