package com.example.seating.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.seating.dto.RoomDTO;
import com.example.seating.entity.Floor;
import com.example.seating.entity.Room;
import com.example.seating.entity.RoomType;
import com.example.seating.repository.FloorRepository;
import com.example.seating.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final FloorRepository floorRepository;

    public RoomDTO createRoom(RoomDTO roomDTO) {
        // Check if room already exists in the floor
        if (roomRepository.existsByRoomNumberAndFloorId(roomDTO.getRoomNumber(), roomDTO.getFloorId())) {
            throw new RuntimeException("Room " + roomDTO.getRoomNumber() + " already exists in this floor!");
        }

        Room room = convertToEntity(roomDTO);
        Room savedRoom = roomRepository.save(room);
        return convertToDTO(savedRoom);
    }

    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check if the new room number already exists in the same floor (if changed)
        if (!existingRoom.getRoomNumber().equals(roomDTO.getRoomNumber()) &&
            roomRepository.existsByRoomNumberAndFloorId(roomDTO.getRoomNumber(), existingRoom.getFloor().getId())) {
            throw new RuntimeException("Room number already exists in this floor!");
        }

        existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        existingRoom.setRoomType(roomDTO.getRoomType());
        
        // Set row and column counts based on room type
        setRoomDimensions(existingRoom, roomDTO.getRoomType());
        
        // Calculate capacity based on dimensions
        existingRoom.setCapacity(calculateCapacity(existingRoom.getRowCount(), existingRoom.getColumnCount()));

        Room updatedRoom = roomRepository.save(existingRoom);
        return convertToDTO(updatedRoom);
    }

    public List<RoomDTO> getRoomsByFloorId(Long floorId) {
        return roomRepository.findByFloorId(floorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    private Room convertToEntity(RoomDTO roomDTO) {
        // Get the floor
        Floor floor = floorRepository.findById(roomDTO.getFloorId())
                .orElseThrow(() -> new RuntimeException("Floor not found"));
        
        // Create room with the specified room type
        Room room = Room.builder()
                .id(roomDTO.getId())
                .roomNumber(roomDTO.getRoomNumber())
                .roomType(roomDTO.getRoomType())
                .floor(floor)
                .build();
        
        // Set row and column counts based on room type
        setRoomDimensions(room, roomDTO.getRoomType());
        
        // Calculate capacity based on dimensions
        room.setCapacity(calculateCapacity(room.getRowCount(), room.getColumnCount()));
        
        return room;
    }

    private void setRoomDimensions(Room room, RoomType roomType) {
        switch (roomType) {
            case ROOM_8X8:
                room.setRowCount(8);
                room.setColumnCount(8);
                break;
            case ROOM_8X12:
                room.setRowCount(8);
                room.setColumnCount(12);
                break;
            default:
                throw new RuntimeException("Unsupported room type");
        }
    }

    private int calculateCapacity(int rows, int columns) {
        // Return the total capacity based on rows and columns
        return rows * columns;
    }

    private RoomDTO convertToDTO(Room room) {
        return new RoomDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getCapacity(),
                room.getRoomType(),
                room.getRowCount(),
                room.getColumnCount(),
                room.getFloor().getId()
        );
    }
}