package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "program")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String programName; // B.Tech, BBA, M.Tech, etc.
    
    @Column(nullable = true)
    private Integer durationYears; // Number of years (4 for B.Tech, 2 for M.Tech, etc.)
}