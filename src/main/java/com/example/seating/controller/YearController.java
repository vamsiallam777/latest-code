package com.example.seating.controller;

import com.example.seating.dto.YearDTO;
import com.example.seating.service.YearService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/years")
@CrossOrigin("*")
@RequiredArgsConstructor
public class YearController {
    private final YearService yearService;

    @GetMapping
    public ResponseEntity<List<YearDTO>> getAllYears() {
        return ResponseEntity.ok(yearService.getAllYears());
    }

    @GetMapping("/program/{programId}")
    public ResponseEntity<List<YearDTO>> getYearsByProgramId(@PathVariable Long programId) {
        return ResponseEntity.ok(yearService.getYearsByProgramId(programId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<YearDTO> getYearById(@PathVariable Long id) {
        try {
            YearDTO yearDTO = yearService.getYearById(id);
            return ResponseEntity.ok(yearDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createYear(@RequestBody YearDTO yearDTO) {
        try {
            YearDTO createdYear = yearService.createYear(yearDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdYear);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateYear(@PathVariable Long id, @RequestBody YearDTO yearDTO) {
        try {
            YearDTO updatedYear = yearService.updateYear(id, yearDTO);
            return ResponseEntity.ok(updatedYear);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteYear(@PathVariable Long id) {
        try {
            yearService.deleteYear(id);
            return ResponseEntity.ok(Map.of("message", "Year deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}