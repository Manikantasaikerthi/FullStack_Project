package com.tribal.marketplace.service;

import com.tribal.marketplace.dto.AuthRequest;
import com.tribal.marketplace.dto.AuthResponse;
import com.tribal.marketplace.dto.SignupRequest;
import com.tribal.marketplace.entity.OTP;
import com.tribal.marketplace.entity.User;
import com.tribal.marketplace.repository.OTPRepository;
import com.tribal.marketplace.repository.UserRepository;
import com.tribal.marketplace.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse registerUser(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return AuthResponse.builder().success(false).message("Email already exists").build();
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "customer");
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        // Customers approved by default, Artisans pending
        user.setApproved("customer".equals(user.getRole()));
        userRepository.save(user);

        return AuthResponse.builder()
                .success(true)
                .message("artisan".equals(user.getRole()) 
                        ? "Registration successful! Waiting for consultant approval." 
                        : "Registration successful! Please login.")
                .build();
    }

    @Transactional
    public AuthResponse loginUser(AuthRequest request) {
        if ("manikantasaikearthi@gmail.com".equals(request.getEmail()) && "Mani@81412241929".equals(request.getPassword())) {
            return generateOtpAndRespond(request.getEmail(), buildHardcodedUser(request.getEmail(), "admin", "Kerthi Manikanta Sai"));
        }
        if ("saisivacharan321@gmail.com".equals(request.getEmail()) && "Sai@2006".equals(request.getPassword())) {
             return generateOtpAndRespond(request.getEmail(), buildHardcodedUser(request.getEmail(), "consultant", "Sai SivaCharan"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return AuthResponse.builder().success(false).message("Invalid credentials").build();
        }

        User user = userOpt.get();
        if ("artisan".equals(user.getRole()) && !user.isApproved()) {
            return AuthResponse.builder().success(false).message("Your artisan account is pending approval by a consultant.").build();
        }

        return generateOtpAndRespond(user.getEmail(), user);
    }

    private User buildHardcodedUser(String email, String role, String name) {
        User u = new User();
        u.setEmail(email);
        u.setRole(role);
        u.setName(name);
        return u;
    }

    private AuthResponse generateOtpAndRespond(String email, User user) {
        String otpCode = emailService.generateOTP();
        
        OTP otp = new OTP();
        otp.setEmail(email);
        otp.setCode(otpCode);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        
        // delete old otps for this email before saving a new one
        otpRepository.deleteByEmail(email);
        otpRepository.flush(); // Force delete to finish

        otpRepository.save(otp);
        otpRepository.flush(); // Force insert to be visible
        System.out.println("OTP successfully saved to database for: " + email);

        try {
            emailService.sendEmail(email, "Your Tribal Marketplace Login OTP", "Your secure OTP is: " + otpCode + ". It expires in 5 minutes.");
        } catch (Exception e) {
            // Log error, but for dev purposes we might want to still proceed or show what the OTP is in logs
            System.err.println("Failed to send email to " + email + " : " + e.getMessage());
            // return AuthResponse.builder().success(false).message("Failed to send OTP email. Please try again.").build();
        }
        
        System.out.println("Generated OTP for " + email + ": " + otpCode); // For debugging locally

        return AuthResponse.builder()
                .success(true)
                .needsOtp(true)
                .message("OTP sent to your email")
                .user(user) // Temp user info
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(String email, String otpCode) {
        Optional<OTP> otpOpt = otpRepository.findFirstByEmailOrderByExpiresAtDesc(email);
        
        if (otpOpt.isEmpty()) {
            return AuthResponse.builder().success(false).message("No OTP found for this email").build();
        }
        
        OTP otp = otpOpt.get();
        
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            return AuthResponse.builder().success(false).message("OTP has expired").build();
        }
        
        if (!otp.getCode().equals(otpCode)) {
            return AuthResponse.builder().success(false).message("Invalid OTP").build();
        }

        // OTP is valid
        otpRepository.deleteByEmail(email);

        // Fetch user or use hardcoded if admin/consultant
        User user;
        if ("manikantasaikearthi@gmail.com".equals(email)) {
            user = buildHardcodedUser(email, "admin", "Kerthi Manikanta Sai");
        } else if ("saisivacharan321@gmail.com".equals(email)) {
             user = buildHardcodedUser(email, "consultant", "Sai SivaCharan");
        } else {
             user = userRepository.findByEmail(email).orElse(null);
             if (user != null && !user.isVerified()) {
                 user.setVerified(true);
                 userRepository.save(user);
             }
        }

        String token = jwtUtil.generateToken(email);

        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .token(token)
                .user(user)
                .build();
    }
}
