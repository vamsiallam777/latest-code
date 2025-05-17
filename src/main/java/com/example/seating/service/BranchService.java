package com.example.seating.service;

import com.example.seating.dto.BranchDTO;
import com.example.seating.entity.Branch;
import com.example.seating.entity.Year;
import com.example.seating.repository.BranchRepository;
import com.example.seating.repository.YearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository branchRepository;
    private final YearRepository yearRepository;

    public BranchDTO createBranch(BranchDTO branchDTO) {
        if (branchRepository.existsByBranchNameAndYearId(branchDTO.getBranchName(), branchDTO.getYearId())) {
            throw new RuntimeException("Branch with this name already exists in the selected year");
        }
        
        Year year = yearRepository.findById(branchDTO.getYearId())
                .orElseThrow(() -> new RuntimeException("Year not found"));
        
        Branch branch = Branch.builder()
                .branchName(branchDTO.getBranchName())
                .year(year)
                .build();
        
        Branch savedBranch = branchRepository.save(branch);
        return convertToDTO(savedBranch);
    }

    public List<BranchDTO> getBranchesByYearId(Long yearId) {
        if (!yearRepository.existsById(yearId)) {
            throw new RuntimeException("Year not found");
        }
        
        return branchRepository.findByYearId(yearId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BranchDTO updateBranch(Long id, BranchDTO branchDTO) {
        Branch existingBranch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        
        Year year = yearRepository.findById(branchDTO.getYearId())
                .orElseThrow(() -> new RuntimeException("Year not found"));
        
        // Check if another branch in the same year already has this name
        if (!existingBranch.getBranchName().equals(branchDTO.getBranchName()) && 
            branchRepository.existsByBranchNameAndYearId(branchDTO.getBranchName(), branchDTO.getYearId())) {
            throw new RuntimeException("Branch with this name already exists in the selected year");
        }
        
        existingBranch.setBranchName(branchDTO.getBranchName());
        existingBranch.setYear(year);
        
        Branch updatedBranch = branchRepository.save(existingBranch);
        return convertToDTO(updatedBranch);
    }

    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new RuntimeException("Branch not found");
        }
        branchRepository.deleteById(id);
    }

    private BranchDTO convertToDTO(Branch branch) {
        return new BranchDTO(
                branch.getId(),
                branch.getBranchName(),
                branch.getYear().getId()
        );
    }
}