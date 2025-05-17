package com.example.seating.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YearDTO {
    private Long id;
    private String yearName;
    private String yearNumber; // First, Second, Third, Fourth
    private Long programId;
    private String programName; // For display purposes
}