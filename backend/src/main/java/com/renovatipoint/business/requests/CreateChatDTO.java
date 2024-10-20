package com.renovatipoint.business.requests;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatDTO {

    private int userId;
    private int expertId;
    private String expertName;
    private String expertEmail;
}
