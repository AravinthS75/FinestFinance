package com.example.springapp.service;

import java.util.List;

import com.example.springapp.model.Loan;

public interface LoanService {
    Loan applyForLoan(String authHeader, int userId, Loan loan);
    List<Loan> getLoansByUserId(Long userId);
    List<Loan> getAllLoans();
    Loan updateLoanStatus(int loanId, String status, String rejectReason);
    List<Loan> getLoansByApproverName(String authHeader, String approverName);
}
