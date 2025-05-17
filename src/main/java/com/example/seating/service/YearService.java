package com.example.seating.service;

import com.example.seating.dto.YearDTO;
import com.example.seating.entity.Program;
import com.example.seating.entity.Year;
import com.example.seating.repository.ProgramRepository;
import com.example.seating.repository.YearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class YearService {
    private final YearRepository yearRepository;
    private final ProgramRepository programRepository;

    public YearDTO createYear(YearDTO yearDTO) {
        if (yearRepository.existsByYearNameAndProgramId(yearDTO.getYearName(), yearDTO.getProgramId())) {
            throw new RuntimeException("Year with this name already exists for this program");
        }
        
        Program program = programRepository.findById(yearDTO.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        Year year = convertToEntity(yearDTO);
        year.setProgram(program);
        
        Year savedYear = yearRepository.save(year);
        return convertToDTO(savedYear);
    }

    public List<YearDTO> getAllYears() {
        return yearRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<YearDTO> getYearsByProgramId(Long programId) {
        return yearRepository.findByProgramId(programId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public YearDTO getYearById(Long id) {
        Year year = yearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Year not found"));
        return convertToDTO(year);
    }

    public YearDTO updateYear(Long id, YearDTO yearDTO) {
        Year existingYear = yearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Year not found"));
        
        Program program = programRepository.findById(yearDTO.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        // Check if another year already has this name in the same program
        if (!existingYear.getYearName().equals(yearDTO.getYearName()) && 
            yearRepository.existsByYearNameAndProgramId(yearDTO.getYearName(), yearDTO.getProgramId())) {
            throw new RuntimeException("Year with this name already exists for this program");
        }
        
        existingYear.setYearName(yearDTO.getYearName());
        existingYear.setYearNumber(yearDTO.getYearNumber());
        existingYear.setProgram(program);
        
        Year updatedYear = yearRepository.save(existingYear);
        return convertToDTO(updatedYear);
    }

    public void deleteYear(Long id) {
        if (!yearRepository.existsById(id)) {
            throw new RuntimeException("Year not found");
        }
        yearRepository.deleteById(id);
    }

    private Year convertToEntity(YearDTO dto) {
        return Year.builder()
                .id(dto.getId())
                .yearName(dto.getYearName())
                .yearNumber(dto.getYearNumber())
                .build();
    }

    private YearDTO convertToDTO(Year year) {
        return new YearDTO(
                year.getId(),
                year.getYearName(),
                year.getYearNumber(),
                year.getProgram().getId(),
                year.getProgram().getProgramName()
        );
    }
}