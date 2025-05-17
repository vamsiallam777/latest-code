package com.example.seating.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.seating.dto.BlockDTO;
import com.example.seating.entity.Block;
import com.example.seating.repository.BlockRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final BlockRepository blockRepository;

    public BlockDTO createBlock(BlockDTO blockDTO) {
        Block block = convertToEntity(blockDTO);
        Block savedBlock = blockRepository.save(block);
        return convertToDTO(savedBlock);
    }

    public List<BlockDTO> getAllBlocks() {
        return blockRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BlockDTO getBlockById(Long id) {
        Block block = blockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Block not found"));
        return convertToDTO(block);
    }

    public BlockDTO updateBlock(Long id, BlockDTO blockDTO) {
        Block existingBlock = blockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Block not found"));
        
        existingBlock.setName(blockDTO.getName());
        Block updatedBlock = blockRepository.save(existingBlock);
        return convertToDTO(updatedBlock);
    }

    public void deleteBlock(Long id) {
        blockRepository.deleteById(id);
    }

    private Block convertToEntity(BlockDTO dto) {
        return Block.builder()
                .id(dto.getBlockId())
                .name(dto.getName())
                .build();
    }

    private BlockDTO convertToDTO(Block block) {
        return new BlockDTO(
                block.getBlockId(),
                block.getName()
        );
    }
}
