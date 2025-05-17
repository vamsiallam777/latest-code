package com.example.seating.dto;

import com.example.seating.entity.ExamType;
import com.example.seating.entity.SetType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamDTO {
    private Long id;
    private String examName;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private ExamType examType;
    private SetType setType;
    private Long programId;
    private String programName;
    private Long yearId;
    private String yearName;
    private List<Long> branchIds;
    private List<Long> sectionIds;
    // For display purposes
    private List<String> branchNames;
    private List<String> sectionNames;
}