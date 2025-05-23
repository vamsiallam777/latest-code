package com.example.seating.repository;

import com.example.seating.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByFloorId(Long floorId);
    boolean existsByRoomNumberAndFloorId(String roomNumber, Long floorId);
}
