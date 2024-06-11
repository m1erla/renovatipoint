package com.renovatipoint.business.requests;

import com.renovatipoint.entities.concretes.Image;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateAdsRequest {
    private int id;
    private String name;
    private String descriptions;
    private String imageUrl;
    private Image images;
    private boolean isActive;
}
