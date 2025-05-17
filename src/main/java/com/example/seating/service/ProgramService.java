package com.example.seating.service;

import com.example.seating.dto.ProgramDTO;
import com.example.seating.entity.Program;
import com.example.seating.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramService {
    private final ProgramRepository programRepository;

    public ProgramDTO createProgram(ProgramDTO programDTO) {
        if (programRepository.existsByProgramName(programDTO.getProgramName())) {
            throw new RuntimeException("Program with this name already exists");
        }
        
        Program program = convertToEntity(programDTO);
        Program savedProgram = programRepository.save(program);
        return convertToDTO(savedProgram);
    }

    public List<ProgramDTO> getAllPrograms() {
        return programRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProgramDTO getProgramById(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        return convertToDTO(program);
    }

    public ProgramDTO updateProgram(Long id, ProgramDTO programDTO) {
        Program existingProgram = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        if (!existingProgram.getProgramName().equals(programDTO.getProgramName()) && 
            programRepository.existsByProgramName(programDTO.getProgramName())) {
            throw new RuntimeException("Program with this name already exists");
        }
        
        existingProgram.setProgramName(programDTO.getProgramName());
        existingProgram.setDurationYears(programDTO.getDurationYears());
        Program updatedProgram = programRepository.save(existingProgram);
        return convertToDTO(updatedProgram);
    }

    public void deleteProgram(Long id) {
        if (!programRepository.existsById(id)) {
            throw new RuntimeException("Program not found");
        }
        programRepository.deleteById(id);
    }

    private Program convertToEntity(ProgramDTO dto) {
        return Program.builder()
                .id(dto.getId())
                .programName(dto.getProgramName())
                .durationYears(dto.getDurationYears())
                .build();
    }

    private ProgramDTO convertToDTO(Program program) {
        return new ProgramDTO(
                program.getId(),
                program.getProgramName(),
                program.getDurationYears()
        );
    }
}