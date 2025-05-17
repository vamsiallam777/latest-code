package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String examName;
    
    @Column(nullable = false)
    private LocalDate examDate;
    
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamType examType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SetType setType;
    
    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @ManyToOne
    @JoinColumn(name = "year_id", nullable = false)
    private Year year;
    
    @ManyToMany
    @JoinTable(
        name = "exam_branches",
        joinColumns = @JoinColumn(name = "exam_id"),
        inverseJoinColumns = @JoinColumn(name = "branch_id")
    )
    private Set<Branch> branches = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "exam_sections",
        joinColumns = @JoinColumn(name = "exam_id"),
        inverseJoinColumns = @JoinColumn(name = "section_id")
    )
    private Set<Section> sections = new HashSet<>();
}