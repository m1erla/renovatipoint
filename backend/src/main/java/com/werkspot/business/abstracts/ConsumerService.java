package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateConsumerRequest;
import com.werkspot.business.requests.UpdateConsumerRequest;
import com.werkspot.business.responses.GetAllByIdConsumersResponse;
import com.werkspot.business.responses.GetAllConsumersResponse;


import java.util.List;

public interface ConsumerService {
    List<GetAllConsumersResponse> getAll();

    GetAllByIdConsumersResponse getById(int id);

    void add(CreateConsumerRequest createConsumerRequest);

    void update(UpdateConsumerRequest updateConsumerRequest);

    void delete(int id);

}
