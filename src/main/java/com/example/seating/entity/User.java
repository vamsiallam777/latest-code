package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;
    
    @Column(name = "user_name")
    private String name;
    
    @Column(name = "user_email")
    private String email;
    
    @Column(name = "user_phone")
    private String phonenumber;
    
    @Column(name = "user_password")
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role;
}
