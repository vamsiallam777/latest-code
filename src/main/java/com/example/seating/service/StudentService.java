package com.example.seating.service;

import com.example.seating.dto.StudentDTO;
import com.example.seating.entity.Section;
import com.example.seating.entity.Student;
import com.example.seating.repository.SectionRepository;
import com.example.seating.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final SectionRepository sectionRepository;
    
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public StudentDTO getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }
    
    public List<StudentDTO> getStudentsBySection(Long sectionId) {
        return studentRepository.findBySectionId(sectionId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = convertToEntity(studentDTO);
        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }
    
    public StudentDTO updateStudent(StudentDTO studentDTO) {
        if (studentDTO.getId() == null) {
            throw new RuntimeException("Student ID cannot be null for update operation");
        }
        
        Student existingStudent = studentRepository.findById(studentDTO.getId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentDTO.getId()));
        
        Student updatedStudent = convertToEntity(studentDTO);
        updatedStudent = studentRepository.save(updatedStudent);
        return convertToDTO(updatedStudent);
    }
    
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
    
    public ByteArrayInputStream exportStudentsToExcel(Long sectionId) throws IOException {
        List<Student> students = studentRepository.findBySectionId(sectionId);
        
        try (Workbook workbook = new XSSFWorkbook(); 
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Students");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Name");
            headerRow.createCell(1).setCellValue("Email");
            headerRow.createCell(2).setCellValue("Registration Number");
            headerRow.createCell(3).setCellValue("Phone Number");
            
            // Create data rows
            int rowIdx = 1;
            for (Student student : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(student.getName());
                row.createCell(1).setCellValue(student.getEmail());
                row.createCell(2).setCellValue(student.getRegistrationNumber());
                row.createCell(3).setCellValue(student.getPhoneNumber());
            }
            
            // Auto-size columns
            for (int i = 0; i < 4; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
    
    public void importStudentsFromExcel(Long sectionId, MultipartFile file) throws IOException {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + sectionId));
        
        List<Student> students = new ArrayList<>();
        
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;
                
                Student student = new Student();
                student.setSection(section);
                
                Cell nameCell = row.getCell(0);
                if (nameCell != null) student.setName(getCellValueAsString(nameCell));
                
                Cell emailCell = row.getCell(1);
                if (emailCell != null) student.setEmail(getCellValueAsString(emailCell));
                
                Cell regNoCell = row.getCell(2);
                if (regNoCell != null) student.setRegistrationNumber(getCellValueAsString(regNoCell));
                
                Cell phoneCell = row.getCell(3);
                if (phoneCell != null) student.setPhoneNumber(getCellValueAsString(phoneCell));
                
                students.add(student);
            }
        }
        
        studentRepository.saveAll(students);
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((long) cell.getNumericCellValue());
        } else {
            return "";
        }
    }
    
    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setRegistrationNumber(student.getRegistrationNumber());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setSectionId(student.getSection() != null ? student.getSection().getId() : null);
        return dto;
    }
    
    private Student convertToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setRegistrationNumber(dto.getRegistrationNumber());
        student.setPhoneNumber(dto.getPhoneNumber());
        
        if (dto.getSectionId() != null) {
            Section section = sectionRepository.findById(dto.getSectionId())
                    .orElseThrow(() -> new RuntimeException("Section not found with id: " + dto.getSectionId()));
            student.setSection(section);
        }
        
        return student;
    }
}