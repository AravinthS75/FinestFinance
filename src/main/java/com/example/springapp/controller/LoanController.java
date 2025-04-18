package com.example.springapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springapp.config.JwtUtils;
import com.example.springapp.model.Loan;
import com.example.springapp.service.LoanServiceImpl;



@RestController
@RequestMapping("/api/loans")
@CrossOrigin(allowedHeaders = "*", origins = {"https://psychic-spork-7ww59r94q67cr6jv-8081.app.github.dev", "https://finest-finance.netlify.app"})
public class LoanController {

    @Autowired
    private LoanServiceImpl loanService;

    @Autowired
    private JwtUtils jwtService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> applyForLoan(@PathVariable Long userId, @RequestBody Loan loan, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);

        Loan savedLoan = loanService.applyForLoan(authHeader,userId, loan);
        if(savedLoan!=null && role.equals("ROLE_USER"))
            return ResponseEntity.status(201).body(savedLoan);

        return ResponseEntity.status(403).body("Only users can apply for loans!");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLoansByUser(@PathVariable Long userId) {
        return ResponseEntity.status(200).body(loanService.getLoansByUserId(userId));
    }

    @GetMapping("/manager/{approverName}")
    public ResponseEntity<?> getLoansByApproverName(@PathVariable String approverName, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);

        List<Loan> managedLoans = loanService.getLoansByApproverName(authHeader, approverName);
        if(!managedLoans.isEmpty() && role.equals("ROLE_ADMIN") || !managedLoans.isEmpty() && role.equals("ROLE_MANAGER"))
            return ResponseEntity.status(200).body(managedLoans);
        return ResponseEntity.status(500).body("No loans available!");
    }

    @GetMapping
    public ResponseEntity<?> getAllLoans(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);

        if(role.equals("ROLE_ADMIN"))        
            return ResponseEntity.status(200).body(loanService.getAllLoans());

        return ResponseEntity.status(403).body("Only Admin has access!");
    }

    @PatchMapping("/manager/{loanId}/status")
    public ResponseEntity<?> updateLoanStatus(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long loanId, @RequestBody Map<String, String> updates) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);
        if(role.equals("ROLE_MANAGER")){
            String status = updates.get("status");
            String reason = updates.get("rejectReason");
            return ResponseEntity.status(200).body(loanService.updateLoanStatus(loanId, status, reason));
        }
        return ResponseEntity.status(403).body("Only Managers can update loans data!");
    }

    @PutMapping("/assign-manager/{userId}/{loanId}/{managerId}")
    public ResponseEntity<?> assignManager(@PathVariable Long userId, @PathVariable Long loanId, @PathVariable Long managerId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);
        if(role.equals("ROLE_ADMIN")){
            return ResponseEntity.status(200).body(loanService.setLoanApprover(userId, loanId, managerId));
        }

        return ResponseEntity.status(403).body("Only Admin can assign mmanager!");
    }

    @PutMapping("/pay-emi/{loanId}")
    public ResponseEntity<?> payEmi(@PathVariable Long loanId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String role = jwtService.extractRole(token);

        if(role.equals("ROLE_USER")){
            return ResponseEntity.ok(loanService.processEmiPayment(loanId));
        }
        return ResponseEntity.status(403).body("Only User can pay EMI!");
    }

}
