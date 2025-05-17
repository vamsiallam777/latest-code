package com.example.seating.controller;

import com.example.seating.dto.BranchDTO;
import com.example.seating.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BranchController {
    private final BranchService branchService;    @GetMapping("/year/{yearId}")
    public ResponseEntity<?> getBranchesByYearId(@PathVariable Long yearId) {
        try {
            List<BranchDTO> branches = branchService.getBranchesByYearId(yearId);
            return ResponseEntity.ok(branches);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/program/{programId}/year/{yearId}")
    public ResponseEntity<?> getBranchesByProgramAndYear(@PathVariable Long programId, @PathVariable Long yearId) {
        try {
            List<BranchDTO> branches = branchService.getBranchesByYearId(yearId);
            return ResponseEntity.ok(branches);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createBranch(@RequestBody BranchDTO branchDTO) {
        try {
            BranchDTO createdBranch = branchService.createBranch(branchDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBranch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBranch(@PathVariable Long id, @RequestBody BranchDTO branchDTO) {
        try {
            BranchDTO updatedBranch = branchService.updateBranch(id, branchDTO);
            return ResponseEntity.ok(updatedBranch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id) {
        try {
            branchService.deleteBranch(id);
            return ResponseEntity.ok(Map.of("message", "Branch deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}