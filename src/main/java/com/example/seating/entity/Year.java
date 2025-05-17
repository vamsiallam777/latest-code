package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "year")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Year {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String yearName;
    
    @Column(name = "year_number")
    private String yearNumber; // First, Second, Third, Fourth
    
    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
}