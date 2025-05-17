package com.example.seating.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvigilatorDTO {
    private Long id;
    private String name;
    private String email;
    private String employeeId;
    private String department;
    private String phoneNumber;
    private String designation;
    private boolean available;
}