package com.example.seating.dto;

import com.example.seating.entity.RoomType;
import lombok.*;

@Data
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private Integer capacity;
    private RoomType roomType;
    private Integer rowCount;
    private Integer columnCount;
    private Long floorId;

    public RoomDTO(Long id, String roomNumber, Integer capacity, RoomType roomType, Integer rowCount, Integer columnCount, Long floorId) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.roomType = roomType;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.floorId = floorId;
    }
    
    public RoomDTO(Long id, String roomNumber, Long floorId) {
        this.roomNumber = roomNumber;
        this.floorId = floorId;
        this.id = id;
    }
}
