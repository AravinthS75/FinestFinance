package com.example.springapp.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.springapp.exception.UserExistException;
import com.example.springapp.exception.UserNameNotFoundException;
import com.example.springapp.model.AuthUser;
import com.example.springapp.model.User;
import com.example.springapp.service.UserServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Admin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserServiceImpl userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user)throws UserExistException{
        try{
        User user1 = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user1);
        }
        catch(UserExistException u){
            return ResponseEntity.status(404).body(u.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> signIn(@RequestBody User loginuser) throws UserNameNotFoundException{
        if(userService.loginUser(loginuser)!=null){
            AuthUser user=userService.loginUser(loginuser);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid User Credentials!!!");
        }
    }


}