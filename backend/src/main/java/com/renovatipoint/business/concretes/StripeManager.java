package com.renovatipoint.business.concretes;

import com.renovatipoint.business.abstracts.InvoiceService;
import com.renovatipoint.business.abstracts.UserService;
import com.renovatipoint.business.requests.SepaPaymentRequest;
import com.renovatipoint.dataAccess.abstracts.PaymentInfoRepository;
import com.renovatipoint.entities.concretes.Expert;
import com.renovatipoint.entities.concretes.Invoice;
import com.renovatipoint.entities.concretes.PaymentInfo;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Component
public class StripeManager {

    private final InvoiceService invoiceService;

    private final UserService userService;

    private final PaymentInfoRepository paymentInfoRepository;


    @Value("${stripe.api-key}")
    private final String secretApiKey;
    public StripeManager(@Value("${stripe.api-key}") String secretApiKey,
                         InvoiceService invoiceService,
                         UserService userService, PaymentInfoRepository paymentInfoRepository) {
        this.secretApiKey = secretApiKey;
        this.invoiceService = invoiceService;
        this.userService = userService;
        this.paymentInfoRepository = paymentInfoRepository;
        Stripe.apiKey = secretApiKey;
    }

    @PostConstruct
    public void init(){
        Stripe.apiKey = secretApiKey;
    }

    // Create SEPA Payment Intent
    public PaymentIntent createSepaPaymentIntent(String customerId, String paymentMethodId, double amount) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100))  // Convert to cents
                .setCurrency("eur")
                .setCustomer(customerId)
                .setPaymentMethod(paymentMethodId)  // Attach the SEPA payment method
                .setConfirm(true)  // Confirm the payment after the method is attached
                .setPaymentMethodOptions(
                        PaymentIntentCreateParams.PaymentMethodOptions.builder()
                                .setSepaDebit(PaymentIntentCreateParams.PaymentMethodOptions.SepaDebit.builder()
                                        .setMandateOptions(PaymentIntentCreateParams.PaymentMethodOptions.SepaDebit.MandateOptions.builder().build())
                                        .build())
                                .build())
                .setMandateData(PaymentIntentCreateParams.MandateData.builder()
                        .setCustomerAcceptance(PaymentIntentCreateParams.MandateData.CustomerAcceptance.builder()
                                .setType(PaymentIntentCreateParams.MandateData.CustomerAcceptance.Type.OFFLINE)
                                .build())
                        .build())
                .setReturnUrl("http://localhost:8080/payment-confirmation")
                .setConfirm(true)
                .build();

        return PaymentIntent.create(params);
    }


    // Create Setup Intent for SEPA Debit
    public SetupIntent createSepaSetupIntent(String customerId) throws StripeException {
        SetupIntentCreateParams params = SetupIntentCreateParams.builder()
                .setCustomer(customerId)
                .addPaymentMethodType("sepa_debit")
                .build();
        return SetupIntent.create(params);
    }

    // Retrieve Payment Receipt URL
    public String retrievePaymentReceiptUrl(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        ChargeListParams chargeListParams = ChargeListParams.builder()
                .setPaymentIntent(paymentIntentId)
                .build();

        ChargeCollection charges = Charge.list(chargeListParams);
        if (!charges.getData().isEmpty()) {
            Charge charge = charges.getData().get(0);
            return charge.getReceiptUrl();
        } else {
            throw new IllegalStateException("No charges found for PaymentIntent: " + paymentIntentId);
        }
    }

    // Create Stripe Customer
    public String createStripeCustomer(String email, String name) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(email)
                .setName(name)
                .build();
        Customer customer = Customer.create(params);
        return customer.getId();
    }

    // Attach Payment Method to Customer
    public void attachPaymentMethodToCustomer(String customerId, String paymentMethodId) throws StripeException {
        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        paymentMethod.attach(PaymentMethodAttachParams.builder()
                .setCustomer(customerId)
                .build());
    }

    // Process SEPA Payment
    public void processSepaPayment(String customerId, BigDecimal amount) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.multiply(new BigDecimal("100")).longValue())  // Convert to cents
                .setCurrency("eur")
                .setCustomer(customerId)
                .addPaymentMethodType("sepa_debit")
                .build();
        PaymentIntent.create(params);
    }

    public void handleSuccessfulPayment(Event event){
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElseThrow();

        String paymentMethodId = paymentIntent.getId();
        String customerId = paymentIntent.getCustomer();
        long amountReceived = paymentIntent.getAmountReceived();

        Invoice invoice = invoiceService.findByPaymentMethodId(paymentMethodId);
        if (invoice == null){
            invoice = invoiceService.findByStripeCustomerId(customerId);
        }

        if (invoice != null){
            invoice.setPaid(true);
            invoice.setPaymentMethodId(paymentMethodId);
            invoice.setAmount(BigDecimal.valueOf(amountReceived / 100.0));
            invoice.setDateIssued(LocalDateTime.now());
            invoiceService.save(invoice);

            userService.sendPaymentConfirmationEmail(invoice.getUser().getEmail(), invoice);

            System.out.println("Payment succeeded for PaymentIntent: " + paymentMethodId);
        }
    }

    public void handleFailedPayment(Event event){
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElseThrow();

        String paymentIntentId = paymentIntent.getId();
        String customerId = paymentIntent.getCustomer();

        Invoice invoice = invoiceService.findByPaymentMethodId(paymentIntentId);
        if (invoice == null){
            invoice = invoiceService.findByStripeCustomerId(customerId);
        }

        if (invoice != null){
            invoice.setPaid(false);
            invoiceService.save(invoice);

            userService.sendPaymentFailureEmail(invoice.getUser().getEmail(), invoice);

            System.out.println("Payment failed for PaymentIntent: " + paymentIntentId);
        }
    }
    public void savePaymentInfo(SepaPaymentRequest request, Expert expert) {
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setIban(request.getIban());
        paymentInfo.setBic(request.getBic());
        paymentInfo.setBankName(request.getBankName());
        paymentInfo.setStripeCustomerId(expert.getStripeCustomerId());
        paymentInfo.setPaymentMethodId(request.getPaymentMethodId());

        expert.setPaymentInfo(paymentInfo);
        paymentInfoRepository.save(paymentInfo);
    }
}
