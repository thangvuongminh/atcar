package loveduong.duongcute.service;

import jakarta.mail.MessagingException;
import org.thymeleaf.context.Context;

public interface EmailService {
    public void sendEmail(String to, String subject, String template, Context context) throws MessagingException;
}
