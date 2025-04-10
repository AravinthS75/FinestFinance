package com.example.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.springapp.model.PasswordResetToken;
import com.example.springapp.model.User;

import java.util.Date;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Find token by token string
    Optional<PasswordResetToken> findByToken(String token);

    // Find tokens by user (in case of multiple tokens)
    Optional<PasswordResetToken> findByUser(User user);

    // Delete expired tokens
    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiryDate < :now")
    void deleteAllExpiredSince(Date now);

    // Optional: Find token with user eager loaded
    @Query("SELECT t FROM PasswordResetToken t JOIN FETCH t.user WHERE t.token = :token")
    Optional<PasswordResetToken> findByTokenWithUser(String token);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user = :user")
    void deleteByUser(User user);
}