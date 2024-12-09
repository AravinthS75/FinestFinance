package com.example.springapp.service;

import java.util.List;

import com.example.springapp.model.Loan;

public interface LoanService {
    Loan applyForLoan(int userId, Loan loan);
    List<Loan> getLoansByUserId(Long userId);
    List<Loan> getAllLoans();
    Loan updateLoanStatus(int loanId, String status);
    List<Loan> getLoansByApproverName(String approverName);
}
