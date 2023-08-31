package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.ConsumerService;
import com.werkspot.business.requests.CreateConsumerRequest;
import com.werkspot.business.requests.UpdateConsumerRequest;
import com.werkspot.business.responses.GetAllByIdConsumersResponse;
import com.werkspot.business.responses.GetAllConsumersResponse;

import java.util.List;

public class ConsumerManager implements ConsumerService {
    @Override
    public List<GetAllConsumersResponse> getAllConsumers() {
        return null;
    }

    @Override
    public GetAllByIdConsumersResponse getById(int id) {
        return null;
    }

    @Override
    public void add(CreateConsumerRequest createConsumerRequest) {

    }

    @Override
    public void update(UpdateConsumerRequest updateConsumerRequest) {

    }

    @Override
    public void delete(int id) {

    }
}
