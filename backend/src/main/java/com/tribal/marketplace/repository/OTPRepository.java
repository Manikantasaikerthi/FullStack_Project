package com.tribal.marketplace.repository;
import com.tribal.marketplace.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findFirstByEmailOrderByExpiresAtDesc(String email);
    @Modifying
    @Transactional
    void deleteByEmail(String email);
}
