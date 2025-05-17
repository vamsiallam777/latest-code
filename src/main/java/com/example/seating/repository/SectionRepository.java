package com.example.seating.repository;

import com.example.seating.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByBranchId(Long branchId);
    boolean existsBySectionNameAndBranchId(String sectionName, Long branchId);
    Optional<Section> findByFormattedName(String formattedName);
}