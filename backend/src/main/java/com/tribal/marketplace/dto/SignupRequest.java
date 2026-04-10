package com.tribal.marketplace.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String role; // 'artisan' or 'customer'
    private String phone;
    private String address;
}
