package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.MasterService;
import com.werkspot.business.requests.CreateMasterRequest;
import com.werkspot.business.requests.UpdateMasterRequest;
import com.werkspot.business.responses.GetAllByIdConsumersResponse;
import com.werkspot.business.responses.GetAllByIdMastersResponse;
import com.werkspot.business.responses.GetAllMastersResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/masters")
@AllArgsConstructor
@CrossOrigin("*")
public class MasterController {

    private MasterService masterService;

    @GetMapping
    public List<GetAllMastersResponse> getAll() {
        return masterService.getAll();
    }

    @GetMapping("/{id}")
    public GetAllByIdMastersResponse getById(@PathVariable int id) {
        return masterService.getById(id);
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void add(@RequestBody CreateMasterRequest createMasterRequest){
           this.masterService.add(createMasterRequest);
    }

    @PutMapping
    public void update(@RequestBody UpdateMasterRequest masterRequest){
        this.masterService.update(masterRequest);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        this.masterService.delete(id);
    }
}
