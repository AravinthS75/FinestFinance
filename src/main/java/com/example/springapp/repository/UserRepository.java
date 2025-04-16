package com.example.springapp.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springapp.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    List<User> findByRole(String role);
    User findById(Long userId);
    User findByName(String name);
}
