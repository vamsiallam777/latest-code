package com.example.seating.dto;

import com.example.seating.entity.Role;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phonenumber;
    private Role role;
}
