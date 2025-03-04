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
    
        if (loan.getLoanAmount() == null) {
            throw new RuntimeException("Loan amount is required");
        }

        loan.setAssignedManager(null);
        loan.setApproverName("Not Assigned Yet!");
    
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

    public Loan setLoanApprover(int userId, int loanId, int managerId ){
        User user = userRepository.findById(userId);
        Loan loanOfUser = loanRepository.findById(loanId).get();
        User manager = userRepository.findById(managerId);
        if(manager.getId() == managerId){
            loanOfUser.setAssignedManager(manager);
            loanOfUser.setApproverName(manager.getName());
        }
        Loan savedLoan = loanRepository.save(loanOfUser);
        user.getLoans().add(savedLoan);
        user = userRepository.save(user);
        return savedLoan;
    }

}

