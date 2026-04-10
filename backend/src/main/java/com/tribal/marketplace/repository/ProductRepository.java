package com.tribal.marketplace.repository;

import com.tribal.marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByArtisanEmail(String artisanEmail);
    List<Product> findByApprovedTrue();
}
