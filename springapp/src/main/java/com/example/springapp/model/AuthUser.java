package com.example.springapp.model;

public class AuthUser {
    String email;
    String token;
    String role;
    Long userId;
    String name;
    public AuthUser() {
    }
    public AuthUser(String email, String token, String role, Long userId, String name) {
        this.email = email;
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
 
}
