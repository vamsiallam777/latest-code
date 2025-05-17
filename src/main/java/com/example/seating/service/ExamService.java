package com.example.seating.service;

import com.example.seating.dto.ExamDTO;
import com.example.seating.entity.*;
import com.example.seating.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {
    
    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;
    private final ProgramRepository programRepository;
    private final YearRepository yearRepository;
    private final BranchRepository branchRepository;
    private final SectionRepository sectionRepository;
    
    public List<ExamDTO> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ExamDTO getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + id));
        return convertToDTO(exam);
    }
    
    public List<ExamDTO> getExamsBySubject(Long subjectId) {
        return examRepository.findBySubjectId(subjectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ExamDTO> getExamsByType(ExamType examType) {
        return examRepository.findByExamType(examType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ExamDTO> getExamsBySectionId(Long sectionId) {
        return examRepository.findBySectionId(sectionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ExamDTO createExam(ExamDTO examDTO) {
        // Validate if there are overlapping exams for the same sections
        boolean hasOverlap = examRepository.hasOverlappingExamsForSections(
            examDTO.getExamDate(), 
            examDTO.getStartTime(), 
            examDTO.getEndTime(), 
            examDTO.getSectionIds(),
            0L // No exam to exclude when creating
        );
        
        if (hasOverlap) {
            throw new RuntimeException("There is an overlapping exam scheduled for the same date and time for one or more sections");
        }
        
        Exam exam = convertToEntity(examDTO);
        Exam savedExam = examRepository.save(exam);
        return convertToDTO(savedExam);
    }
    
    @Transactional
    public ExamDTO updateExam(Long id, ExamDTO examDTO) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Exam not found with id: " + id);
        }
        
        // Check for overlapping exams excluding this one
        boolean hasOverlap = examRepository.hasOverlappingExamsForSections(
            examDTO.getExamDate(), 
            examDTO.getStartTime(), 
            examDTO.getEndTime(), 
            examDTO.getSectionIds(),
            id // Exclude current exam from check
        );
        
        if (hasOverlap) {
            throw new RuntimeException("There is an overlapping exam scheduled for the same date and time for one or more sections");
        }
        
        examDTO.setId(id);
        Exam exam = convertToEntity(examDTO);
        Exam updatedExam = examRepository.save(exam);
        return convertToDTO(updatedExam);
    }
    
    @Transactional
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Exam not found with id: " + id);
        }
        examRepository.deleteById(id);
    }
    
    private ExamDTO convertToDTO(Exam exam) {
        ExamDTO dto = new ExamDTO();
        dto.setId(exam.getId());
        dto.setExamName(exam.getExamName());
        dto.setExamDate(exam.getExamDate());
        dto.setStartTime(exam.getStartTime());
        dto.setEndTime(exam.getEndTime());
        dto.setExamType(exam.getExamType());
        dto.setSetType(exam.getSetType());
        
        // Subject info
        dto.setSubjectId(exam.getSubject().getId());
        dto.setSubjectCode(exam.getSubject().getCode());
        dto.setSubjectName(exam.getSubject().getName());
        
        // Program info
        dto.setProgramId(exam.getProgram().getId());
        dto.setProgramName(exam.getProgram().getProgramName());
        
        // Year info
        dto.setYearId(exam.getYear().getId());
        dto.setYearName(exam.getYear().getYearName());
        
        // Branch IDs and names
        List<Long> branchIds = exam.getBranches().stream()
                .map(Branch::getId)
                .collect(Collectors.toList());
        dto.setBranchIds(branchIds);
        
        List<String> branchNames = exam.getBranches().stream()
                .map(Branch::getBranchName)
                .collect(Collectors.toList());
        dto.setBranchNames(branchNames);
        
        // Section IDs and names
        List<Long> sectionIds = exam.getSections().stream()
                .map(Section::getId)
                .collect(Collectors.toList());
        dto.setSectionIds(sectionIds);
        
        List<String> sectionNames = exam.getSections().stream()
                .map(Section::getFormattedName)
                .collect(Collectors.toList());
        dto.setSectionNames(sectionNames);
        
        return dto;
    }
    
    private Exam convertToEntity(ExamDTO dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + dto.getSubjectId()));
        
        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + dto.getProgramId()));
        
        Year year = yearRepository.findById(dto.getYearId())
                .orElseThrow(() -> new RuntimeException("Year not found with id: " + dto.getYearId()));
          // Generate exam name if not provided
        String examName = dto.getExamName();
        if (examName == null || examName.trim().isEmpty()) {
            examName = subject.getCode() + " - " + subject.getName() + " - " + 
                dto.getExamType().name() + " (" + dto.getExamDate() + ")";
        }
        
        Exam exam = new Exam();
        exam.setId(dto.getId());
        exam.setExamName(examName);
        exam.setExamDate(dto.getExamDate());
        exam.setStartTime(dto.getStartTime());
        exam.setEndTime(dto.getEndTime());
        exam.setExamType(dto.getExamType());
        exam.setSetType(dto.getSetType());
        exam.setSubject(subject);
        exam.setProgram(program);
        exam.setYear(year);
        
        // Set branches
        if (dto.getBranchIds() != null && !dto.getBranchIds().isEmpty()) {
            Set<Branch> branches = new HashSet<>();
            for (Long branchId : dto.getBranchIds()) {
                Branch branch = branchRepository.findById(branchId)
                        .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));
                branches.add(branch);
            }
            exam.setBranches(branches);
        }
        
        // Set sections
        if (dto.getSectionIds() != null && !dto.getSectionIds().isEmpty()) {
            Set<Section> sections = new HashSet<>();
            for (Long sectionId : dto.getSectionIds()) {
                Section section = sectionRepository.findById(sectionId)
                        .orElseThrow(() -> new RuntimeException("Section not found with id: " + sectionId));
                sections.add(section);
            }
            exam.setSections(sections);
        }
        
        return exam;
    }
}