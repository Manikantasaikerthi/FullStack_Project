package com.tribal.marketplace.dto;

import com.tribal.marketplace.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private boolean needsOtp;
    private String token;
    private User user;
}
