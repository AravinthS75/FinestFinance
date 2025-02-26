package com.example.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.config.JwtUtils;
import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;

@RestController
@CrossOrigin(origins = "https://psychic-spork-7ww59r94q67cr6jv-8081.app.github.dev", allowedHeaders = "*")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtils jwtService;

    @GetMapping("/admin/{userId}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAdminDetails(@PathVariable int userId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        System.out.println(token);

        String role = jwtService.extractRole(token);
        System.out.println("Roles in token: " + role);

        User userDetails = userRepo.findById(userId);
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(userDetails);
    }   

    @GetMapping
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getUserDetails(@RequestParam String email) {
        User userDetails = userRepo.findByEmail(email);

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(userDetails);
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<?> getManagerDetails(@RequestParam String email) {
        User userDetails = userRepo.findByEmail(email);

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(userDetails);
    }

    @PutMapping("/admin/{userId}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateAdminProfile(
        @PathVariable int userId,
        @RequestBody User updatedUser,
        @RequestHeader("Authorization") String authHeader) {
        
        User existingUser = userRepo.findById(userId);

        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setProfilePicture(updatedUser.getProfilePicture());
        existingUser.setMimeType(updatedUser.getMimeType());
        
        userRepo.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }
}
