package com.werkspot.business.abstracts;

import com.werkspot.business.requests.CreateConsumerRequest;
import com.werkspot.business.requests.UpdateConsumerRequest;
import com.werkspot.business.responses.GetAllByIdConsumersResponse;
import com.werkspot.business.responses.GetAllConsumersResponse;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public interface ConsumerService {
    List<GetAllConsumersResponse> getAllConsumers();

    GetAllByIdConsumersResponse getById(int id);

    void add(CreateConsumerRequest createConsumerRequest);

    void update(UpdateConsumerRequest updateConsumerRequest);

    void delete(int id);

}
