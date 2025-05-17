package com.example.seating.repository;

import com.example.seating.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findByBlockId(Long blockId);
    boolean existsByFloorNumberAndBlockId(Integer floorNumber, Long blockId);
}
