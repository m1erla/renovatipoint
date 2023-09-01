package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.ConsumerService;
import com.werkspot.business.requests.CreateConsumerRequest;
import com.werkspot.business.requests.UpdateConsumerRequest;
import com.werkspot.business.responses.GetAllByIdConsumersResponse;
import com.werkspot.business.responses.GetAllConsumersResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consumers")
@AllArgsConstructor

public class ConsumerController {
    private ConsumerService consumerService;

    @GetMapping()
    public List<GetAllConsumersResponse> getAll() {
        return consumerService.getAll();
    }

    @GetMapping("/{id}")
    public GetAllByIdConsumersResponse getById(@PathVariable int id) {
        return consumerService.getById(id);
    }

    @PostMapping()
    @ResponseStatus(code=HttpStatus.CREATED)
    public void add(@RequestBody CreateConsumerRequest createConsumerRequest){
        this.consumerService.add(createConsumerRequest);
    }

    @PutMapping
    public void update(@RequestBody UpdateConsumerRequest updateConsumerRequest){
        this.consumerService.update(updateConsumerRequest);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        this.consumerService.delete(id);
    }

}
