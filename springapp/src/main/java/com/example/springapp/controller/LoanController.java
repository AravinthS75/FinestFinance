package com.example.springapp.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.config.JwtUtils;
import com.example.springapp.model.Loan;
import com.example.springapp.service.LoanServiceImpl;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/loans")
@CrossOrigin(allowedHeaders = "*", origins = "https://psychic-spork-7ww59r94q67cr6jv-8081.app.github.dev")
public class LoanController {

    @Autowired
    private LoanServiceImpl loanService;

    @Autowired
    private JwtUtils jwtService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> applyForLoan(@PathVariable int userId, @RequestBody Loan loan, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String role = jwtService.extractRole(token);
        System.out.println(role);
        if (role.equals("ROLE_USER")) { 
            Loan savedLoan = loanService.applyForLoan(userId, loan);
            return ResponseEntity.status(201).body(savedLoan);
        }
        return ResponseEntity.status(403).body("Only users can apply for loans");
    }

    @GetMapping("/user/{userId}") // all users
    public ResponseEntity<?> getLoansByUser(@PathVariable Long userId) {
        return ResponseEntity.status(200).body(loanService.getLoansByUserId(userId));
    }

    @GetMapping("/manager/{approverName}") // manager alone
    public ResponseEntity<?> getLoansByUser(@PathVariable String approverName) {
        return ResponseEntity.status(200).body(loanService.getLoansByApproverName(approverName));
    }

    @GetMapping
    public ResponseEntity<?> getAllLoans(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);
        System.out.println(role);

        if(role.equals("ROLE_ADMIN"))        
        return ResponseEntity.status(200).body(loanService.getAllLoans());

        return ResponseEntity.status(403).body("Only Admin has access!");
    }

    @PatchMapping("/manager/{loanId}/status") // manager alone
    public ResponseEntity<?> updateLoanStatus(@PathVariable int loanId, @RequestBody Map<String, String> updates) {
        return ResponseEntity.status(200).body(loanService.updateLoanStatus(loanId, updates.get("status")));
    }

    @PutMapping("/assign-manager/{userId}/{loanId}/{managerId}")
    public ResponseEntity<?> assignManager(@PathVariable int userId, @PathVariable int loanId, @PathVariable int managerId) {
        return ResponseEntity.status(200).body(loanService.setLoanApprover(userId, loanId, managerId));
    }
}
