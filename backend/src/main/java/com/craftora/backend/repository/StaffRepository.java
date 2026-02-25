package com.craftora.backend.repository;

import com.craftora.backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByUsernameAndPasswordAndPhone(
            String username,
            String password,
            String phone
    );
}