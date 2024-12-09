package com.example.springapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        logger.debug("Entering in loadUserByUsername Method...");
        User user = userRepo.findByEmail(username);
        if(user == null){
            logger.error("Username not found: " + username);
            throw new UsernameNotFoundException("Invalid username");
        }
        logger.info("User Authenticated Successfully..!!!");
        logger.info(user+"");
        return new CustomUserDetails(user);
    }
}