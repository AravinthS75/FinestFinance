package com.example.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springapp.repository.UserRepository;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(allowedHeaders = "*", origins = "http://localhost:8081")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all-users") // admin alone
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.status(200).body(userRepository.findByRole("USER"));
    }

    @GetMapping("/all-managers")
    public ResponseEntity<?> getAllManagers() {
        return ResponseEntity.status(200).body(userRepository.findByRole("MANAGER"));
    }

}
