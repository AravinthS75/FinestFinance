package com.example.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springapp.config.JwtUtils;
import com.example.springapp.model.Loan;
import com.example.springapp.model.User;
import com.example.springapp.repository.LoanRepository;
import com.example.springapp.repository.UserRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;

import java.time.temporal.ChronoUnit;


@Service
public class LoanServiceImpl implements LoanService{
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtService;

    public Loan applyForLoan(String authHeader, Long userId, Loan loan) {
        String token = authHeader.replace("Bearer ", "");
        String role = jwtService.extractRole(token);

        if (role.equals("ROLE_USER")) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            if (loan.getLoanAmount() == null) {
                throw new RuntimeException("Loan amount is required");
            }

            loan.setAssignedManager(null);
            loan.setApproverName("Not Assigned Yet!");

            loan.setStatus("PENDING");
            loan.setUser(user);
            loan.setPendingAmount(loan.getEmiAmount() * Double.parseDouble(loan.getTenure()));
            loan.setInterestRatePerAnnum(loan.getInterestRatePerAnnum() != null ? loan.getInterestRatePerAnnum() : 12.5);
            loan.setPendingAmount(loan.getEmiAmount() * loan.getTenure());
            loan.setEmiAmount(loan.getEmiAmount());
            loan.setLoanVarient(loan.getLoanVarient());
            loan.setPurpose(loan.getPurpose());

            loan.setAadharCard(loan.getAadharCard());
            loan.setPanCard(loan.getPanCard());

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
        else
            return null;
    }

    public List<Loan> getLoansByUserId(Long userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        LocalDate currentDate = LocalDate.now();
        
        loans.forEach(loan -> {
            if (loan.getPendingAmount() == null) {
                loan.setPendingAmount(0.0);
            }
            if ("APPROVED".equals(loan.getStatus())) {
                Date dueDate = loan.getDueDate();
                if (dueDate != null) {
                    LocalDate dueLocalDate = dueDate.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
    
                    if (currentDate.isAfter(dueLocalDate)) {
                        long monthsOverdue = ChronoUnit.MONTHS.between(
                            dueLocalDate, 
                            currentDate
                        );
                        
                        double penalty = loan.getEmiAmount() * 0.10 * monthsOverdue;
                        
                        loan.setPendingAmount(
                            loan.getPendingAmount() + penalty
                        );
                    }
                }
            }
        });
        
        return loans;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan updateLoanStatus(Long loanId, String status, String rejectReason) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus(status);
    
        if ("REJECTED".equals(status)) {
            loan.setRejectReason(rejectReason);
        } else {
            loan.setRejectReason(null);
        }
    
        LocalDate currentDate = LocalDate.now();
        Date date = Date.from(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        loan.setUpdatedAt(date);
    
        if ("APPROVED".equals(status)) {
            LocalDate dueDate = currentDate.plusMonths(1);
            Date dueDateConverted = Date.from(dueDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            loan.setDueDate(dueDateConverted);
        }
    
        return loanRepository.save(loan);
    }

    public List<Loan> getLoansByApproverName(String authHeader, String approverName){
        String token = authHeader.replace("Bearer ", "");
        String role = jwtService.extractRole(token);

        if(role.equals("ROLE_MANAGER")){
            List<Loan> managedLoans = loanRepository.findByApproverName(approverName);

            if(!managedLoans.isEmpty())
                return managedLoans;
        }
        return null;
    }

    public Loan setLoanApprover(Long userId, Long loanId, Long managerId ){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Loan loanOfUser = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));
        User manager = userRepository.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        if(manager.getId() == managerId){
            loanOfUser.setAssignedManager(manager);
            loanOfUser.setApproverName(manager.getName());
        }
        Loan savedLoan = loanRepository.save(loanOfUser);
        user.getLoans().add(savedLoan);
        user = userRepository.save(user);
        return savedLoan;
    }

    public Loan processEmiPayment(Long loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));
    
        if (!"APPROVED".equals(loan.getStatus())) {
            throw new RuntimeException("Loan is not approved");
        }
    
        LocalDate currentDate = LocalDate.now();
    
        if (loan.getDueDate() == null) {
            loan.setDueDate(Date.from(currentDate.plusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        }
    
        LocalDate dueDateLocal = loan.getDueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    
        if (currentDate.isAfter(dueDateLocal)) {
            long monthsOverdue = ChronoUnit.MONTHS.between(dueDateLocal, currentDate);
            double penalty = loan.getEmiAmount() * 0.10 * monthsOverdue;
            loan.setPendingAmount(loan.getPendingAmount() - (loan.getEmiAmount() + penalty));
        } else {
            loan.setPendingAmount(loan.getPendingAmount() - loan.getEmiAmount());
        }
    
        LocalDate newDueDate = dueDateLocal.plusMonths(1);
        loan.setDueDate(Date.from(newDueDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
    
        long tenureMonths = Long.parseLong(loan.getTenure().split(" ")[0]);
        long monthsPaid = ChronoUnit.MONTHS.between(
            loan.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
            newDueDate
        );
    
        if (monthsPaid >= tenureMonths || loan.getPendingAmount() <= 0) {
            loan.setStatus("COMPLETED");
        }
    
        loan.setUpdatedAt(new Date());
        return loanRepository.save(loan);
    }    

}