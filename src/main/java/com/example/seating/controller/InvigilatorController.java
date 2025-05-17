package com.example.seating.controller;

import com.example.seating.dto.InvigilatorDTO;
import com.example.seating.service.InvigilatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invigilators")
@CrossOrigin("*")
@RequiredArgsConstructor
public class InvigilatorController {
    
    private final InvigilatorService invigilatorService;
    
    @GetMapping
    public ResponseEntity<List<InvigilatorDTO>> getAllInvigilators() {
        return ResponseEntity.ok(invigilatorService.getAllInvigilators());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getInvigilatorById(@PathVariable Long id) {
        try {
            InvigilatorDTO invigilator = invigilatorService.getInvigilatorById(id);
            return ResponseEntity.ok(invigilator);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createInvigilator(@RequestBody InvigilatorDTO invigilatorDTO) {
        try {
            InvigilatorDTO createdInvigilator = invigilatorService.createInvigilator(invigilatorDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInvigilator);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvigilator(@PathVariable Long id, @RequestBody InvigilatorDTO invigilatorDTO) {
        try {
            InvigilatorDTO updatedInvigilator = invigilatorService.updateInvigilator(id, invigilatorDTO);
            return ResponseEntity.ok(updatedInvigilator);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvigilator(@PathVariable Long id) {
        try {
            invigilatorService.deleteInvigilator(id);
            return ResponseEntity.ok(Map.of("message", "Invigilator successfully deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}