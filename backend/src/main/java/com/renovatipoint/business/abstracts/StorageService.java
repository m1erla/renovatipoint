package com.renovatipoint.business.abstracts;

import com.renovatipoint.business.responses.GetAllImagesResponse;
import com.renovatipoint.entities.concretes.Image;

import java.util.List;

public interface StorageService {

    List<GetAllImagesResponse> getAll();
}
