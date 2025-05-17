package com.example.seating.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "floor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Floor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer floorNumber;
    
    @ManyToOne
    @JoinColumn(name = "block_id", nullable = false)
    private Block block;
}
