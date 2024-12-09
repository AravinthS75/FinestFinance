package com.example.springapp.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.model.Loan;
import com.example.springapp.service.LoanServiceImpl;


@RestController
@RequestMapping("/api/loans")
@CrossOrigin(allowedHeaders = "*", origins = "*")
public class LoanController {

    @Autowired
    private LoanServiceImpl loanService;

    @PostMapping("/user/{userId}") // all users
    public ResponseEntity<?> applyForLoan(@PathVariable int userId, @RequestBody Loan loan) {
        return ResponseEntity.status(201).body(loanService.applyForLoan(userId,loan));
    }

    @GetMapping("/user/{userId}") // all users
    public ResponseEntity<?> getLoansByUser(@PathVariable Long userId) {
        return ResponseEntity.status(200).body(loanService.getLoansByUserId(userId));
    }

    @GetMapping("/manager/{approverName}") // manager alone
    public ResponseEntity<?> getLoansByUser(@PathVariable String approverName) {
        return ResponseEntity.status(200).body(loanService.getLoansByApproverName(approverName));
    }

    @GetMapping //admin alone
    public ResponseEntity<?> getAllLoans() {
        return ResponseEntity.status(200).body(loanService.getAllLoans());
    }

    @PatchMapping("/manager/{loanId}/status") // manager alone
    public ResponseEntity<?> updateLoanStatus(@PathVariable int loanId, @RequestBody Map<String, String> updates) {
        return ResponseEntity.status(200).body(loanService.updateLoanStatus(loanId, updates.get("status")));
    }
}
