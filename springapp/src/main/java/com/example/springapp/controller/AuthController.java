package com.example.springapp.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.springapp.exception.UserExistException;
import com.example.springapp.exception.UserNameNotFoundException;
import com.example.springapp.model.AuthUser;
import com.example.springapp.model.User;
import com.example.springapp.service.UserService;

@RestController
@CrossOrigin(origins = "https://psychic-spork-7ww59r94q67cr6jv-8081.app.github.dev", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (UserExistException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists: " + e.getMessage());
        }
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> signIn(@RequestBody User loginUser) {
        try {
            AuthUser authUser = userService.loginUser(loginUser);
            if (authUser != null) {
                return ResponseEntity.status(HttpStatus.OK).body(authUser);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
            }
        } catch (UserNameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        }
    }
}
