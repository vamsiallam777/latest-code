package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invigilators")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invigilator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, unique = true)
    private String employeeId;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @Column(nullable = true)
    private String designation;
      @Column(nullable = true)
    private boolean available = true;
}