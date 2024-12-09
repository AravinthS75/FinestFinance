package com.example.springapp.service;

import com.example.springapp.model.AuthUser;
import com.example.springapp.model.User;

public interface UserService {
    User registerUser(User user);
    AuthUser loginUser(User user);
    User getUserByEmail(String email);
    // User updateUser(User user);
}

