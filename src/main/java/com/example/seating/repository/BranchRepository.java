package com.example.seating.repository;

import com.example.seating.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByYearId(Long yearId);
    boolean existsByBranchNameAndYearId(String branchName, Long yearId);
}