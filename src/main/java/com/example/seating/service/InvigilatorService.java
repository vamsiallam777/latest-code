package com.example.seating.service;

import com.example.seating.dto.InvigilatorDTO;
import com.example.seating.entity.Invigilator;
import com.example.seating.repository.InvigilatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvigilatorService {
    
    private final InvigilatorRepository invigilatorRepository;
    
    public List<InvigilatorDTO> getAllInvigilators() {
        return invigilatorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public InvigilatorDTO getInvigilatorById(Long id) {
        return invigilatorRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Invigilator not found with id: " + id));
    }
    
    public InvigilatorDTO createInvigilator(InvigilatorDTO invigilatorDTO) {
        // Check if email already exists
        if (invigilatorRepository.existsByEmail(invigilatorDTO.getEmail())) {
            throw new RuntimeException("Invigilator with this email already exists");
        }
        
        // Check if employee ID already exists
        if (invigilatorRepository.existsByEmployeeId(invigilatorDTO.getEmployeeId())) {
            throw new RuntimeException("Invigilator with this employee ID already exists");
        }
        
        Invigilator invigilator = convertToEntity(invigilatorDTO);
        Invigilator savedInvigilator = invigilatorRepository.save(invigilator);
        return convertToDTO(savedInvigilator);
    }
    
    public InvigilatorDTO updateInvigilator(Long id, InvigilatorDTO invigilatorDTO) {
        Invigilator existingInvigilator = invigilatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invigilator not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!existingInvigilator.getEmail().equals(invigilatorDTO.getEmail()) && 
            invigilatorRepository.existsByEmail(invigilatorDTO.getEmail())) {
            throw new RuntimeException("Invigilator with this email already exists");
        }
        
        // Check if employee ID is being changed and if it already exists
        if (!existingInvigilator.getEmployeeId().equals(invigilatorDTO.getEmployeeId()) && 
            invigilatorRepository.existsByEmployeeId(invigilatorDTO.getEmployeeId())) {
            throw new RuntimeException("Invigilator with this employee ID already exists");
        }
        
        // Update fields
        existingInvigilator.setName(invigilatorDTO.getName());
        existingInvigilator.setEmail(invigilatorDTO.getEmail());
        existingInvigilator.setEmployeeId(invigilatorDTO.getEmployeeId());
        existingInvigilator.setDepartment(invigilatorDTO.getDepartment());
        existingInvigilator.setPhoneNumber(invigilatorDTO.getPhoneNumber());
        existingInvigilator.setDesignation(invigilatorDTO.getDesignation());
        existingInvigilator.setAvailable(invigilatorDTO.isAvailable());
        
        Invigilator updatedInvigilator = invigilatorRepository.save(existingInvigilator);
        return convertToDTO(updatedInvigilator);
    }
    
    public void deleteInvigilator(Long id) {
        if (!invigilatorRepository.existsById(id)) {
            throw new RuntimeException("Invigilator not found with id: " + id);
        }
        invigilatorRepository.deleteById(id);
    }
    
    private InvigilatorDTO convertToDTO(Invigilator invigilator) {
        return new InvigilatorDTO(
                invigilator.getId(),
                invigilator.getName(),
                invigilator.getEmail(),
                invigilator.getEmployeeId(),
                invigilator.getDepartment(),
                invigilator.getPhoneNumber(),
                invigilator.getDesignation(),                invigilator.isAvailable()
        );
    }
    
    private Invigilator convertToEntity(InvigilatorDTO dto) {
        return Invigilator.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .employeeId(dto.getEmployeeId())
                .department(dto.getDepartment())
                .phoneNumber(dto.getPhoneNumber())
                .designation(dto.getDesignation())
                .available(dto.isAvailable())
                .build();
    }
}