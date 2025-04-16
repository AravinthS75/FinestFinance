package com.example.springapp.repository;

import java.util.List;
import com.example.springapp.model.Loan;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByApproverName(String approverName);
}

