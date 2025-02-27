package com.example.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springapp.config.JwtUtils;
import com.example.springapp.repository.UserRepository;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin( allowedHeaders = "*", origins = "https://psychic-spork-7ww59r94q67cr6jv-8081.app.github.dev" )
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtService;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);
        
        if(role.equals("ROLE_ADMIN") || role.equals("ROLE_MANAGER"))
        return ResponseEntity.status(200).body(userRepository.findByRole("USER"));

        return ResponseEntity.status(500).body("Only Admin or Manager can access users data!");
    }

    @GetMapping("/all-managers")
    public ResponseEntity<?> getAllManagers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);

        if(role.equals("ROLE_ADMIN"))
        return ResponseEntity.status(200).body(userRepository.findByRole("MANAGER"));

        return ResponseEntity.status(500).body("Only Admin can access users data!");
    }

}
