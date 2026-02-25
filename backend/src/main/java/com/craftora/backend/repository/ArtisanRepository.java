package com.craftora.backend.repository;

import com.craftora.backend.model.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ArtisanRepository extends JpaRepository<Artisan, Long> {

    Optional<Artisan> findByUsernameAndPasswordAndPhone(
            String username,
            String password,
            String phone
    );

    List<Artisan> findByStatus(String status);
}