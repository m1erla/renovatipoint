package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.abstracts.ExpertService;
import com.renovatipoint.business.abstracts.UserService;
import com.renovatipoint.business.concretes.ExpertManager;
import com.renovatipoint.business.concretes.StripeManager;
import com.renovatipoint.business.requests.SepaPaymentRequest;
import com.renovatipoint.business.requests.UpdateExpertRequest;
import com.renovatipoint.business.responses.GetExpertResponse;
import com.renovatipoint.dataAccess.abstracts.ExpertRepository;
import com.renovatipoint.dataAccess.abstracts.PaymentInfoRepository;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.Expert;
import com.renovatipoint.entities.concretes.PaymentInfo;
import com.renovatipoint.security.jwt.JwtService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import com.stripe.param.PaymentMethodAttachParams;
import com.stripe.param.PaymentMethodCreateParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/experts")
public class ExpertController {

    private final ExpertService expertService;

    private final ExpertRepository expertRepository;
    private final UserRepository userRepository;
    private final ExpertManager expertManager;
    private final UserService userService;

    private final JwtService jwtService;

    private final StripeManager stripeManager;

    private final PaymentInfoRepository paymentInfoRepository;

    public ExpertController(ExpertService expertService, ExpertRepository expertRepository, UserRepository userRepository, ExpertManager expertManager, UserService userService, JwtService jwtService, StripeManager stripeManager, PaymentInfoRepository paymentInfoRepository) {
        this.expertService = expertService;
        this.expertRepository = expertRepository;
        this.userRepository = userRepository;
        this.expertManager = expertManager;
        this.userService = userService;
        this.jwtService = jwtService;
        this.stripeManager = stripeManager;
        this.paymentInfoRepository = paymentInfoRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetExpertResponse> getExpertById(@PathVariable String id){
        GetExpertResponse expert = expertService.getExpertById(id);

        return ResponseEntity.ok(expert);
    }

    @GetMapping("/responseExpert")
    public ResponseEntity<GetExpertResponse> retrieveExpertProfileWithResponse(@RequestHeader("Authorization") String authorizationHeader) {
        // Extract the token from the Authorization header (remove "Bearer " prefix)
        String jwt = authorizationHeader.substring(7).trim();

        String email = jwtService.extractUsername(jwt);
        return ResponseEntity.ok(userService.getExpertByEmail(email));
    }
    @GetMapping("/profile")
    public ResponseEntity<GetExpertResponse> getExpertProfile(Principal principal) {
        String email = principal.getName();  // Extract email from the authenticated user
        GetExpertResponse expert = expertService.getByEmail(email);
        return ResponseEntity.ok(expert);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@ModelAttribute UpdateExpertRequest updateExpertRequest) throws IOException {
        return this.expertManager.update(updateExpertRequest);
    }

    @PostMapping("/setup-sepa")
    public ResponseEntity<?> setupSepaPaymentMethod(@RequestBody SepaPaymentRequest request, Principal principal) throws StripeException {
        Expert expert = expertRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalStateException("Expert not found!"));

        // Create a SEPA Payment Method
        PaymentMethodCreateParams createParams = PaymentMethodCreateParams.builder()
                .setType(PaymentMethodCreateParams.Type.SEPA_DEBIT)
                .setSepaDebit(
                        PaymentMethodCreateParams.SepaDebit.builder()
                                .setIban(request.getIban())
                                .build()
                )
                .setBillingDetails(
                        PaymentMethodCreateParams.BillingDetails.builder()
                                .setName(expert.getName())
                                .setEmail(expert.getEmail())
                                .build()
                )
                .build();

        PaymentMethod paymentMethod = PaymentMethod.create(createParams);

        // Attach the payment method to the Stripe customer
        PaymentMethodAttachParams attachParams = PaymentMethodAttachParams.builder()
                .setCustomer(expert.getStripeCustomerId())
                .build();

        paymentMethod = paymentMethod.attach(attachParams);

        // Save payment info in the database
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setIban(request.getIban());
        paymentInfo.setBic(request.getBic());
        paymentInfo.setBankName(request.getBankName());
        paymentInfo.setStripeCustomerId(expert.getStripeCustomerId());
        paymentInfo.setPaymentMethodId(paymentMethod.getId());

        expert.setPaymentInfo(paymentInfo);
        paymentInfoRepository.save(paymentInfo);

        // Return customerId and paymentMethodId for frontend storage
        Map<String, String> response = new HashMap<>();
        response.put("customerId", expert.getStripeCustomerId());
        response.put("paymentMethodId", paymentMethod.getId());

        return ResponseEntity.ok(response);
    }

}
