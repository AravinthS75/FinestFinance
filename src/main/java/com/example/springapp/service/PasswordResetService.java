package com.example.springapp.service;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.springapp.model.PasswordResetToken;
import com.example.springapp.model.User;
import com.example.springapp.repository.PasswordResetTokenRepository;
import com.example.springapp.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private UserService userService;

     @Autowired
    private PasswordEncoder passwordEncoder;

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

        passwordResetTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.flush();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(calculateExpiryDate());
        passwordResetTokenRepository.save(resetToken);

        sendPasswordResetEmail(user, resetToken.getToken());
    }

    private Date calculateExpiryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, 1);
        return calendar.getTime();
    }

    private void sendPasswordResetEmail(User user, String token) {
        String resetUrl = "https://psychic-spork-7ww59r94q67cr6jv-8081.app.github.dev/reset-password?pass_reset=" + token;
        String subject = "Password Reset Request";
        String content = "Hi " + user.getName() + "!\n\n"
            + "We received a request to reset your password. Click the link below to proceed:\n\n"
            + resetUrl + "\n\n"
            + "This password reset link will expire in 1 hour for security reasons.\n\n"
            + "If you didn't request this password reset, please ignore this email or contact our support team immediately.\n\n"
            + "For your security:\n"
            + "- Never share this link with anyone\n"
            + "- The link can only be used once\n"
            + "- You'll need to request a new link if expired\n\n"
            + "Best regards,\n"
            + "Finest Finance Team";
        emailService.sendEmail(user.getEmail(), subject, content);
    }

    public String resetUserPassword(String token, String password){
        Long validToken = userService.validatePasswordResetToken(token);
        if(validToken!=null){
            User user = userRepository.findById(validToken).orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + validToken));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return "Password reset successfull!";
        }
        return "Password reset failed!";
    }
}