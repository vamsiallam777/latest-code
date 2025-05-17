package com.example.seating.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectionDTO {
    private Long id;
    private String sectionName;
    private String formattedName; // Added formatted name field
    private Integer capacity;
    private Long branchId;
}