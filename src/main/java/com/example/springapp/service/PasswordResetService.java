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
        String resetUrl = "https://finest-finance.netlify.app/reset-password?pass_reset=" + token;
        String subject = "Password Reset Request";
        String content = "<!DOCTYPE html>"
            + "<html lang=\"en\">"
            + "<head>"
            + "  <meta charset=\"UTF-8\">"
            + "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">"
            + "  <style>"
            + "    body {"
            + "      background-color:rgb(29, 27, 27);"
            + "      color: #00ffea;"
            + "      font-family: 'Courier New', monospace;"
            + "      line-height: 1.5;"
            + "      padding: 20px;"
            + "    }"
            + "    p { margin: 0 0 1em; }"
            + "    .btn {"
            + "      display: inline-block;"
            + "      padding: 12px 28px;"
            + "      background: linear-gradient(45deg, #ff00cc, #3333ff);"
            + "      color: #ffffff !important;"
            + "      text-decoration: none;"
            + "      font-weight: bold;"
            + "      border-radius: 6px;"
            + "      box-shadow: 0 0 8px #ff00cc, 0 0 16px #3333ff;"
            + "      text-shadow: 0 0 4px #ffffff;"
            + "    }"
            + "    .btn:hover {"
            + "      box-shadow: 0 0 12px #ff00cc, 0 0 24px #3333ff;"
            + "    }"
            + "  </style>"
            + "</head>"
            + "<body>"
            + "  <p style=\"margin-left: 25%;\">Hi <strong>" + user.getName() + "</strong>,</p>"
            + "  <p style=\"margin-left: 25%;\">We received a request to reset your password.</p>"
            + "  <p style=\"margin-left: 25%;\">Click the button below to reset your password.</p>"
            + "  <p>"
            + "    <a href=\"" + resetUrl + "\""
            + "       class=\"btn\""
            + "       style=\""
            + "         display: inline-block;"
            + "         padding: 12px 28px;"
            + "         background: linear-gradient(45deg, #ff00cc, #3333ff);"
            + "         color: #ffffff !important;"
            + "         text-decoration: none;"
            + "         margin-left: 35%;"
            + "         font-weight: bold;"
            + "         border-radius: 6px;"
            + "         box-shadow: 0 0 8px #ff00cc,0 0 16px #3333ff;"
            + "         text-shadow: 0 0 4px #ffffff;"
            + "       \">"
            + "      Reset Password"
            + "    </a>"
            + "  </p>"
            + "  <p style=\"font-size:0.9em; color:#888888; margin-left:25%\">"
            + "    This link expires in <strong>1 hour</strong>.<br>"
            + "    If you didn't ask, simply ignore this message."
            + "  </p>"
            + "  <p style=\"margin-left:25%\">— Finest Finance Team</p>"
            + "</body>"
            + "</html>";

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