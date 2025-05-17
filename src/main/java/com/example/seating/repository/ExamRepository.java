package com.example.seating.repository;

import com.example.seating.entity.Exam;
import com.example.seating.entity.ExamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findBySubjectId(Long subjectId);
    
    List<Exam> findByExamType(ExamType examType);
    
    List<Exam> findByExamDate(LocalDate date);
    
    List<Exam> findByProgramId(Long programId);
    
    List<Exam> findByYearId(Long yearId);
    
    @Query("SELECT e FROM Exam e JOIN e.branches b WHERE b.id = :branchId")
    List<Exam> findByBranchId(Long branchId);
    
    @Query("SELECT e FROM Exam e JOIN e.sections s WHERE s.id = :sectionId")
    List<Exam> findBySectionId(Long sectionId);
    
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Exam e " +
           "WHERE e.examDate = :date AND " +
           "((e.startTime <= :endTime AND e.endTime >= :startTime) OR " +
           "(e.startTime >= :startTime AND e.startTime < :endTime)) AND " +
           "e.id <> :excludeId")
    boolean hasOverlappingExams(LocalDate date, LocalTime startTime, LocalTime endTime, Long excludeId);
    
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Exam e " +
           "JOIN e.sections s " +
           "WHERE e.examDate = :date AND " +
           "((e.startTime <= :endTime AND e.endTime >= :startTime) OR " +
           "(e.startTime >= :startTime AND e.startTime < :endTime)) AND " +
           "s.id IN :sectionIds AND " +
           "e.id <> :excludeId")
    boolean hasOverlappingExamsForSections(LocalDate date, LocalTime startTime, LocalTime endTime, 
                                         List<Long> sectionIds, Long excludeId);
}