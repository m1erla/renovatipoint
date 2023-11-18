package com.werkspot.business.concretes;

import com.werkspot.business.abstracts.EmailSenderService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.websocket.Session;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.Message;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;




@Service
@AllArgsConstructor
public class EmailManager implements EmailSenderService {
    private final static Logger LOGGER = LoggerFactory.getLogger(EmailManager.class);
    private final JavaMailSender mailSender;
    @Override
    @Async
    public void send(String to, String email) {
         try {
             MimeMessage mimeMessage = mailSender.createMimeMessage();
             MimeMessageHelper helper =
                     new MimeMessageHelper(mimeMessage, "utf-8");
             helper.setText(email, true);
             helper.setTo(to);
             helper.setSubject("Confirm your email");
             helper.setFrom("firstconfirm@mail.com");
             mailSender.send(mimeMessage);
         }catch (MessagingException e ){
             LOGGER.error("failed to send email", e);
             throw new IllegalStateException("failed to send email");
         }
    }
}
