package com.example.seating.controller;

import com.example.seating.dto.SectionDTO;
import com.example.seating.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sections")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SectionController {
    private final SectionService sectionService;

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<?> getSectionsByBranchId(@PathVariable Long branchId) {
        try {
            List<SectionDTO> sections = sectionService.getSectionsByBranchId(branchId);
            return ResponseEntity.ok(sections);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createSection(@RequestBody SectionDTO sectionDTO) {
        try {
            SectionDTO createdSection = sectionService.createSection(sectionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSection);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSection(@PathVariable Long id, @RequestBody SectionDTO sectionDTO) {
        try {
            SectionDTO updatedSection = sectionService.updateSection(id, sectionDTO);
            return ResponseEntity.ok(updatedSection);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        try {
            sectionService.deleteSection(id);
            return ResponseEntity.ok(Map.of("message", "Section deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}