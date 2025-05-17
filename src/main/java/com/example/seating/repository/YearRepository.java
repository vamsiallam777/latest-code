package com.example.seating.repository;

import com.example.seating.entity.Year;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface YearRepository extends JpaRepository<Year, Long> {
    boolean existsByYearNameAndProgramId(String yearName, Long programId);
    List<Year> findByProgramId(Long programId);
}