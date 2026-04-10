package com.tribal.marketplace.repository;

import com.tribal.marketplace.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByArtisanEmail(String artisanEmail);
}
