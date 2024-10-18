package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.concretes.StripeManager;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
public class StripePaymentController {

    private final StripeManager stripeManager;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    // Constructor-based dependency injection

    public StripePaymentController(StripeManager stripeManager) {
        this.stripeManager = stripeManager;
    }

    // Create SEPA Payment Intent
    @PostMapping("/create-sepa-payment-intent")
    public ResponseEntity<?> createSepaPaymentIntent(@RequestBody Map<String, Object> paymentData) {
        try {
            String customerId = (String) paymentData.get("customerId");
            String paymentMethodId = (String) paymentData.get("paymentMethodId");
            double amount = Double.parseDouble(paymentData.get("amount").toString());

            // Create PaymentIntent via StripeManager
            PaymentIntent paymentIntent = stripeManager.createSepaPaymentIntent(customerId, paymentMethodId, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("id", paymentIntent.getId());
            response.put("status", paymentIntent.getStatus());
            response.put("amount", paymentIntent.getAmount());
            response.put("currency", paymentIntent.getCurrency());
            response.put("client_secret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(response);
        } catch (StripeException ex) {
            // Return a specific error message with error details
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create SEPA payment intent: " + ex.getMessage());
        } catch (Exception e) {
            // Handle generic errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid input data: " + e.getMessage());
        }
    }

    // Handle Stripe Webhook events
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) throws IOException {
        String payload = request.getReader().lines().collect(Collectors.joining());
        String sigHeader = request.getHeader("Stripe-Signature");

        try {
            // Construct and verify the event using the Stripe webhook secret
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);

            // Handle different event types
            switch (event.getType()) {
                case "payment_intent.succeeded":
                    stripeManager.handleSuccessfulPayment(event);
                    break;
                case "payment_intent.payment_failed":
                    stripeManager.handleFailedPayment(event);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unhandled event type");
            }

            return ResponseEntity.ok("Webhook received and processed.");
        } catch (SignatureVerificationException e) {
            // Return error if the signature is invalid
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook error: " + e.getMessage());
        }
    }

    // Charge customer using SEPA direct debit
    @PostMapping("/charge")
    public ResponseEntity<String> chargeCustomer(@RequestParam String customerId, @RequestParam BigDecimal amount) {
        try {
            // Process payment via StripeManager
            stripeManager.processSepaPayment(customerId, amount);
            return ResponseEntity.ok("Payment successful!");
        } catch (StripeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Payment failed: " + ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        }
    }

//    @GetMapping("/payment")
//    public String showPaymentPage(Model model) throws StripeException {
//        // Create a PaymentIntent and return the client_secret
//        PaymentIntent paymentIntent = stripeManager.createSepaPaymentIntent("customerId", 100.0);  // Example customer ID and amount
//        String clientSecret = paymentIntent.getClientSecret();
//
//        // Pass the client secret to the Thymeleaf model
//        model.addAttribute("clientSecret", clientSecret);
//
//        return "payment";
//    }

}
