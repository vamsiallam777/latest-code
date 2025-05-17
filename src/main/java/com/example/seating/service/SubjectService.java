package com.example.seating.service;

import com.example.seating.dto.SubjectDTO;
import com.example.seating.entity.Subject;
import com.example.seating.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {
    
    private final SubjectRepository subjectRepository;
    
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public SubjectDTO getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
    }
    
    public SubjectDTO getSubjectByCode(String code) {
        return subjectRepository.findByCode(code)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Subject not found with code: " + code));
    }
    
    public SubjectDTO createSubject(SubjectDTO subjectDTO) {
        // Check if code already exists
        if (subjectRepository.existsByCode(subjectDTO.getCode())) {
            throw new RuntimeException("Subject with this code already exists");
        }
        
        Subject subject = convertToEntity(subjectDTO);
        Subject savedSubject = subjectRepository.save(subject);
        return convertToDTO(savedSubject);
    }
    
    public SubjectDTO updateSubject(Long id, SubjectDTO subjectDTO) {
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        
        // Check if code is being changed and if it already exists
        if (!existingSubject.getCode().equals(subjectDTO.getCode()) && 
            subjectRepository.existsByCode(subjectDTO.getCode())) {
            throw new RuntimeException("Subject with this code already exists");
        }
          // Update fields
        existingSubject.setName(subjectDTO.getName());
        existingSubject.setCode(subjectDTO.getCode());
        
        Subject updatedSubject = subjectRepository.save(existingSubject);
        return convertToDTO(updatedSubject);
    }
    
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }
      private SubjectDTO convertToDTO(Subject subject) {
        return new SubjectDTO(
                subject.getId(),
                subject.getName(),
                subject.getCode()
        );
    }
      private Subject convertToEntity(SubjectDTO dto) {
        return Subject.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .build();
    }
}