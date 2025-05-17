package com.example.seating.controller;

import com.example.seating.dto.ExamDTO;
import com.example.seating.entity.ExamType;
import com.example.seating.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ExamController {
    
    private final ExamService examService;
    
    @GetMapping
    public ResponseEntity<List<ExamDTO>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getExamById(@PathVariable Long id) {
        try {
            ExamDTO examDTO = examService.getExamById(id);
            return ResponseEntity.ok(examDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<ExamDTO>> getExamsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(examService.getExamsBySubject(subjectId));
    }
    
    @GetMapping("/type/{examType}")
    public ResponseEntity<List<ExamDTO>> getExamsByType(@PathVariable ExamType examType) {
        return ResponseEntity.ok(examService.getExamsByType(examType));
    }
    
    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<ExamDTO>> getExamsBySection(@PathVariable Long sectionId) {
        return ResponseEntity.ok(examService.getExamsBySectionId(sectionId));
    }
    
    @PostMapping
    public ResponseEntity<?> createExam(@RequestBody ExamDTO examDTO) {
        try {
            ExamDTO createdExam = examService.createExam(examDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExam);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody ExamDTO examDTO) {
        try {
            ExamDTO updatedExam = examService.updateExam(id, examDTO);
            return ResponseEntity.ok(updatedExam);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        try {
            examService.deleteExam(id);
            return ResponseEntity.ok(Map.of("message", "Exam successfully deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}