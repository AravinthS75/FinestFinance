package com.example.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-loans")
    private User user;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonBackReference("manager-loans")
    private User assignedManager;

    private Double loanAmount;
    private Double pendingAmount;
    private String purpose;
    private String loanVarient;
    private Double interestRatePerAnnum;
    private String tenure;
    private Double emiAmount;
    private Date dueDate;
    private String status; // 'PENDING', 'APPROVED', 'REJECTED'
    private Date createdAt;
    private Date updatedAt;
    private String approverName;

    public Loan() {
    }

    public Loan(Long id, User user, User assignedManager, Double loanAmount, Double pendingAmount, String purpose, 
                String loanVarient, Double interestRatePerAnnum, String tenure, Double emiAmount, Date dueDate, 
                String status, Date createdAt, Date updatedAt, String approverName) {
        this.id = id;
        this.user = user;
        this.assignedManager = assignedManager;
        this.loanAmount = loanAmount;
        this.pendingAmount = pendingAmount;
        this.purpose = purpose;
        this.loanVarient = loanVarient;
        this.interestRatePerAnnum = interestRatePerAnnum;
        this.tenure = tenure;
        this.emiAmount = emiAmount;
        this.dueDate = dueDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.approverName = approverName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getPendingAmount() {
        return pendingAmount;
    }

    public void setPendingAmount(Double pendingAmount) {
        this.pendingAmount = pendingAmount;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getLoanVarient() {
        return loanVarient;
    }

    public void setLoanVarient(String loanVarient) {
        this.loanVarient = loanVarient;
    }

    public Double getInterestRatePerAnnum() {
        return interestRatePerAnnum;
    }

    public void setInterestRatePerAnnum(Double interestRatePerAnnum) {
        this.interestRatePerAnnum = interestRatePerAnnum;
    }

    public String getTenure() {
        return tenure;
    }

    public void setTenure(String tenure) {
        this.tenure = tenure;
    }

    public Double getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(Double emiAmount) {
        this.emiAmount = emiAmount;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getApproverName() {
        return approverName;
    }

    public void setApproverName(String approverName) {
        this.approverName = approverName;
    }

    public Double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(Double loanAmount) {
        this.loanAmount = loanAmount;
    }
    public User getAssignedManager() {
        return assignedManager;
    }

    public void setAssignedManager(User assignedManager) {
        this.assignedManager = assignedManager;
    }    
}
