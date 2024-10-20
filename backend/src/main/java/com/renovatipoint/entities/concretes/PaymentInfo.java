package com.renovatipoint.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @OneToOne(mappedBy = "paymentInfo")
    private Expert expert;
    @Column(name = "iban", nullable = false)
    private String iban;
    @Column(name = "bic", nullable = false)
    private String bic;
    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "stripe_customer_id", nullable = false)
    private String stripeCustomerId;

    @Column(name = "stripe_payment_intent_id", nullable = false)
    private String paymentMethodId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
