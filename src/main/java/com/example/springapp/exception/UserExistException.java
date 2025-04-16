package com.example.springapp.exception;

public class UserExistException extends RuntimeException{
    public UserExistException(){}
    public UserExistException(String msg){
     super(msg);
    }
 }