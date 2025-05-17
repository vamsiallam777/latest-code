package com.example.seating.dto;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
    private String phonenumber;
}
