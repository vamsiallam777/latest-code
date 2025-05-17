package com.example.seating.controller;

import com.example.seating.dto.BlockDTO;
import com.example.seating.repository.BlockRepository;
import com.example.seating.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blocks")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BlockController {
    private final BlockRepository blockRepository;
    private final BlockService blockService;

    @PostMapping
    public ResponseEntity<?> createBlock(@RequestBody BlockDTO blockDTO) {
        try {
            if (blockRepository.existsByName(blockDTO.getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Block name already exists!"));
            }
            BlockDTO createdBlock = blockService.createBlock(blockDTO);
            return ResponseEntity.ok(createdBlock);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create block"));
        }
    }

    @GetMapping
    public ResponseEntity<List<BlockDTO>> getAllBlocks() {
        return ResponseEntity.ok(blockService.getAllBlocks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlockDTO> getBlockById(@PathVariable Long id) {
        return ResponseEntity.ok(blockService.getBlockById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlockDTO> updateBlock(@PathVariable Long id, @RequestBody BlockDTO blockDTO) {
        return ResponseEntity.ok(blockService.updateBlock(id, blockDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlock(@PathVariable Long id) {
        blockService.deleteBlock(id);
        return ResponseEntity.ok().build();
    }
}
