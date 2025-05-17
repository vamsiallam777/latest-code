package com.example.seating.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FloorDTO {
    private Long id;
    private Integer floorNumber;
    private Long blockId;
}
