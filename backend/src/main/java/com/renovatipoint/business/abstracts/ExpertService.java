package com.renovatipoint.business.abstracts;

import com.renovatipoint.business.responses.GetExpertResponse;
import com.renovatipoint.business.responses.GetUsersResponse;
import com.renovatipoint.entities.concretes.Expert;

public interface ExpertService {

    GetExpertResponse getExpertById(String expertId);
    Expert getById(String expertId);
    GetExpertResponse getByEmail(String email);
}
