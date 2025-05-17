package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
      @Column(nullable = false)
    private String sectionName;
    
    @Column(name = "formatted_name")
    private String formattedName; // Stores the format "BranchName - SectionName"
    
    @Column(nullable = false)
    private Integer capacity;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
}