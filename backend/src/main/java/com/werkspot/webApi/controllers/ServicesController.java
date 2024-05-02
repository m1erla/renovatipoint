package com.werkspot.webApi.controllers;

import com.werkspot.business.abstracts.IService;
import com.werkspot.business.requests.CreateServiceRequest;
import com.werkspot.business.requests.UpdateServiceRequest;
import com.werkspot.business.responses.GetAllServicesResponse;
import com.werkspot.business.responses.GetServiceByIdResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/services")
@AllArgsConstructor
public class ServicesController {
    private IService iService;


    @GetMapping
    public List<GetAllServicesResponse> getAllServices(){
        return iService.getAll();
    }

    @GetMapping("/{id}")
    public GetServiceByIdResponse getServiceById(@PathVariable int id){
        return iService.getById(id);
    }

    @PostMapping("/service")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void addService(@RequestBody CreateServiceRequest createServiceRequest){
        this.iService.add(createServiceRequest);
    }

    @PutMapping("/service_update/{id}")
    public void updateService(@RequestBody UpdateServiceRequest updateServiceRequest){
        this.iService.update(updateServiceRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable int id){
        this.iService.delete(id);
    }
}
