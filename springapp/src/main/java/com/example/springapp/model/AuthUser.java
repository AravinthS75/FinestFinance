package com.example.springapp.model;

public class AuthUser {
    String email;
    String token;
    String role;
    Long userId;
    public AuthUser() {
    }
    public AuthUser(String email, String token, String role, Long userId) {
        this.email = email;
        this.token = token;
        this.role = role;
        this.userId = userId;
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
 
}
