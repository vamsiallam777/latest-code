package com.example.seating.service;

import com.example.seating.dto.SectionDTO;
import com.example.seating.entity.Branch;
import com.example.seating.entity.Section;
import com.example.seating.repository.BranchRepository;
import com.example.seating.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionService {
    private final SectionRepository sectionRepository;
    private final BranchRepository branchRepository;

    public SectionDTO createSection(SectionDTO sectionDTO) {
        if (sectionRepository.existsBySectionNameAndBranchId(sectionDTO.getSectionName(), sectionDTO.getBranchId())) {
            throw new RuntimeException("Section with this name already exists in the selected branch");
        }
        
        Branch branch = branchRepository.findById(sectionDTO.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
          // Create formatted name by combining branch name and section name
        String formattedName = branch.getBranchName() + " - " + sectionDTO.getSectionName();
        
        Section section = Section.builder()
                .sectionName(sectionDTO.getSectionName())
                .formattedName(formattedName)
                .capacity(sectionDTO.getCapacity())
                .branch(branch)
                .build();
        
        Section savedSection = sectionRepository.save(section);
        return convertToDTO(savedSection);
    }

    public List<SectionDTO> getSectionsByBranchId(Long branchId) {
        if (!branchRepository.existsById(branchId)) {
            throw new RuntimeException("Branch not found");
        }
        
        return sectionRepository.findByBranchId(branchId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SectionDTO updateSection(Long id, SectionDTO sectionDTO) {
        Section existingSection = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        
        Branch branch = branchRepository.findById(sectionDTO.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        
        // Check if another section in the same branch already has this name
        if (!existingSection.getSectionName().equals(sectionDTO.getSectionName()) && 
            sectionRepository.existsBySectionNameAndBranchId(sectionDTO.getSectionName(), sectionDTO.getBranchId())) {
            throw new RuntimeException("Section with this name already exists in the selected branch");
        }
          // Update formatted name
        String formattedName = branch.getBranchName() + " - " + sectionDTO.getSectionName();
        
        existingSection.setSectionName(sectionDTO.getSectionName());
        existingSection.setFormattedName(formattedName);
        existingSection.setCapacity(sectionDTO.getCapacity());
        existingSection.setBranch(branch);
        
        Section updatedSection = sectionRepository.save(existingSection);
        return convertToDTO(updatedSection);
    }

    public void deleteSection(Long id) {
        if (!sectionRepository.existsById(id)) {
            throw new RuntimeException("Section not found");
        }
        sectionRepository.deleteById(id);
    }    private SectionDTO convertToDTO(Section section) {
        return new SectionDTO(
                section.getId(),
                section.getSectionName(),
                section.getFormattedName(),
                section.getCapacity(),
                section.getBranch().getId()
        );
    }
}