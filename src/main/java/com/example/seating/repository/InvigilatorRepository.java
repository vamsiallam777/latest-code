package com.example.seating.repository;

import com.example.seating.entity.Invigilator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InvigilatorRepository extends JpaRepository<Invigilator, Long> {
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    Optional<Invigilator> findByEmail(String email);
    Optional<Invigilator> findByEmployeeId(String employeeId);
}