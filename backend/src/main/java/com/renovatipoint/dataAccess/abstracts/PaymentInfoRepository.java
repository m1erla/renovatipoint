package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, String> {

    Optional<PaymentInfo> findByStripeCustomerId(String stripeCustomerId);

    Optional<PaymentInfo> findByIban(String iban);
}
