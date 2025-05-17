package com.example.seating.repository;

import com.example.seating.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    boolean existsByProgramName(String programName);
}