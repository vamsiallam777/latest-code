package com.example.seating.repository;

import com.example.seating.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhonenumber(String phonenumber);
    Optional<User> findByPhonenumber(String phonenumber);
}