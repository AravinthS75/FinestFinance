package com.example.springapp.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Date expiryDate;

    public PasswordResetToken() {}

    public Date getExpiryDate(){
        return expiryDate;
    }

    public Long getId() { 
        return id; 
    }

    public String getToken() { 
        return token; 
    }

    public User getUser() { 
        return user; 
    }

    public void setToken(String token){
        this.token = token;
    }

    public void setUser(User user){
        this.user = user;
    }

    public void setExpiryDate(Date date){
        this.expiryDate = date;
    }

}