package com.example.seating.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.seating.dto.FloorDTO;
import com.example.seating.service.FloorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/floors")
@CrossOrigin("*")
@RequiredArgsConstructor
public class FloorController {
    private final FloorService floorService;

    @PostMapping
    public ResponseEntity<?> createFloor(@RequestBody FloorDTO floorDTO) {
        try {
            FloorDTO createdFloor = floorService.createFloor(floorDTO);
            return ResponseEntity.ok(createdFloor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to create floor"));
        }
    }

    @GetMapping("/block/{blockId}")
    public ResponseEntity<List<FloorDTO>> getFloorsByBlockId(@PathVariable Long blockId) {
        return ResponseEntity.ok(floorService.getFloorsByBlockId(blockId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFloor(@PathVariable Long id) {
        floorService.deleteFloor(id);
        return ResponseEntity.ok().build();
    }
}
