package com.craftora.backend.repository;

import com.craftora.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUsernameAndPasswordAndPhone(
            String username,
            String password,
            String phone
    );
}