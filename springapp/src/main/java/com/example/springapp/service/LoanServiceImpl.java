package com.example.springapp.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springapp.model.Loan;
import com.example.springapp.model.User;
import com.example.springapp.repository.LoanRepository;
import com.example.springapp.repository.UserRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;


@Service
public class LoanServiceImpl implements LoanService{
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private UserRepository userRepository;

    public Loan applyForLoan(int userId, Loan loan) {
        User user = userRepository.findById(userId);
        List<User> managers = userRepository.findByRole("MANAGER");
    
        if (loan.getLoanAmount() == null) {
            throw new RuntimeException("Loan amount is required");
        }

        if (!managers.isEmpty()) {
            User manager = managers.get(0); // Simplistic assignment; adjust as needed
            loan.setAssignedManager(manager);
            loan.setApproverName(manager.getName());
        }
    
        loan.setStatus("PENDING");
        loan.setUser(user);
        loan.setPendingAmount(loan.getLoanAmount());
        loan.setInterestRatePerAnnum(loan.getInterestRatePerAnnum() != null ? loan.getInterestRatePerAnnum() : 12.5);
        loan.setEmiAmount(loan.getEmiAmount());
        loan.setLoanVarient(loan.getLoanVarient());
        loan.setPurpose(loan.getPurpose());
        LocalDate currentDate = LocalDate.now();
        Date date = Date.from(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        loan.setCreatedAt(date);
        loan.setUpdatedAt(null);
        loan.setDueDate(null);
    
        Loan savedLoan = loanRepository.save(loan);

        if (user.getLoans() == null) {
            user.setLoans(new ArrayList<>());
        }
        user.getLoans().add(savedLoan);
        userRepository.save(user);

        return savedLoan;
    }

    public List<Loan> getLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan updateLoanStatus(int loanId, String status) {
        Loan loan = loanRepository.findById(loanId).orElseThrow();
        loan.setStatus(status);
        LocalDate currentDate = LocalDate.now();
        Date date = Date.from(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        loan.setUpdatedAt(date);
        if(status.equals("APPROVED")){
        LocalDate dueDate = currentDate.plusMonths(1);
        Date dueDateConverted = Date.from(dueDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        loan.setDueDate(dueDateConverted);
        }
        return loanRepository.save(loan);
    }

    public List<Loan> getLoansByApproverName(String approverName){
        return loanRepository.findByApproverName(approverName);
    }

}

