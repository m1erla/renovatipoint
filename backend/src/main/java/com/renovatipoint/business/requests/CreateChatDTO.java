package com.renovatipoint.business.requests;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatDTO {

    private String userId;
    private String expertId;
    private String expertName;
    private String expertEmail;
}
