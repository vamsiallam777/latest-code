package com.example.seating.service;

import com.example.seating.dto.FloorDTO;
import com.example.seating.entity.Floor;
import com.example.seating.entity.Block;
import com.example.seating.repository.FloorRepository;
import com.example.seating.repository.BlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FloorService {
    private final FloorRepository floorRepository;
    private final BlockRepository blockRepository;

    public FloorDTO createFloor(FloorDTO floorDTO) {
        // Check if floor already exists in the block
        if (floorRepository.existsByFloorNumberAndBlockId(floorDTO.getFloorNumber(), floorDTO.getBlockId())) {
            throw new RuntimeException("Floor " + floorDTO.getFloorNumber() + " already exists in this block!");
        }

        Block block = blockRepository.findById(floorDTO.getBlockId())
                .orElseThrow(() -> new RuntimeException("Block not found"));

        Floor floor = Floor.builder()
                .floorNumber(floorDTO.getFloorNumber())
                .block(block)
                .build();

        Floor savedFloor = floorRepository.save(floor);
        return convertToDTO(savedFloor);
    }

    public List<FloorDTO> getFloorsByBlockId(Long blockId) {
        return floorRepository.findByBlockId(blockId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public void deleteFloor(Long id) {
        floorRepository.deleteById(id);
    }

    private FloorDTO convertToDTO(Floor floor) {
        return new FloorDTO(
                floor.getId(),
                floor.getFloorNumber(),
                floor.getBlock().getId()
        );
    }
}
