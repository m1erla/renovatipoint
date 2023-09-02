package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.ConsumerService;
import com.werkspot.business.requests.CreateConsumerRequest;
import com.werkspot.business.requests.UpdateConsumerRequest;
import com.werkspot.business.responses.GetAllByIdConsumersResponse;
import com.werkspot.business.responses.GetAllConsumersResponse;
import com.werkspot.business.rules.ConsumerBusinessRules;
import com.werkspot.core.utilities.mappers.ModelMapperService;
import com.werkspot.dataAccess.abstracts.ConsumerRepository;
import com.werkspot.entities.concretes.Consumer;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@AllArgsConstructor
public class ConsumerManager implements ConsumerService {
    private ConsumerRepository consumerRepository;
    private ModelMapperService modelMapperService;
    private ConsumerBusinessRules consumerBusinessRules;

    @Override
    public List<GetAllConsumersResponse> getAll() {
        List<Consumer> consumers = consumerRepository.findAll();

        List<GetAllConsumersResponse> consumersResponse =
                consumers.stream().map(consumer -> this.modelMapperService.forResponse()
                        .map(consumer, GetAllConsumersResponse.class)).collect(Collectors.toList());
        return consumersResponse;
    }

    @Override
    public GetAllByIdConsumersResponse getById(int id) {
        Consumer consumer = this.consumerRepository.findById(id).orElseThrow();

        GetAllByIdConsumersResponse response =
                this.modelMapperService.forResponse().map(consumer, GetAllByIdConsumersResponse.class);

        return response;
    }

    @Override
    public void add(CreateConsumerRequest createConsumerRequest) {
        this.consumerBusinessRules.checkIfInfoExists(createConsumerRequest.getName());
        Consumer consumer = this.modelMapperService.forRequest().map(createConsumerRequest, Consumer.class);
        this.consumerRepository.save(consumer);

    }

    @Override
    public void update(UpdateConsumerRequest updateConsumerRequest) {
        Consumer consumer = this.modelMapperService.forRequest().map(updateConsumerRequest, Consumer.class);
        this.consumerRepository.save(consumer);

    }

    @Override
    public void delete(int id) {
        this.consumerRepository.deleteById(id);

    }
}
