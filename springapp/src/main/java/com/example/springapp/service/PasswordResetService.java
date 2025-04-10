package com.example.springapp.service;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.springapp.model.PasswordResetToken;
import com.example.springapp.model.User;
import com.example.springapp.repository.PasswordResetTokenRepository;
import com.example.springapp.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public PasswordResetService(UserRepository userRepository,
                               PasswordResetTokenRepository passwordResetTokenRepository,
                               EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public void processPasswordResetRequest(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        String token = generateResetToken();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(calculateExpiryDate());
        passwordResetTokenRepository.save(resetToken);

        sendPasswordResetEmail(user, token);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    private Date calculateExpiryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, 1);
        return calendar.getTime();
    }

    private void sendPasswordResetEmail(User user, String token) {
        String resetUrl = "https://yourapp.com/reset-password?token=" + token;
        String subject = "Password Reset Request";
        String content = "To reset your password, click the link below:\n" + resetUrl;

        emailService.sendEmail(user.getEmail(), subject, content);
    }
}