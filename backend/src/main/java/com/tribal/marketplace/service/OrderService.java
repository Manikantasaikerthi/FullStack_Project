package com.tribal.marketplace.service;

import com.tribal.marketplace.entity.Order;
import com.tribal.marketplace.entity.OrderItem;
import com.tribal.marketplace.repository.OrderItemRepository;
import com.tribal.marketplace.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Order createOrder(Order order) {
        order.setStatus("PENDING");
        // Link items to the order before saving
        if (order.getItems() != null) {
            order.getItems().forEach(item -> {
                item.setOrder(order);
                item.setStatus("PENDING");
            });
        }
        return orderRepository.save(order);
    }

    public List<Order> getCustomerOrders(String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> updateOrderStatus(Long orderId, String newStatus) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(newStatus);
            return orderRepository.save(order);
        });
    }

    public Optional<Order> updateItemStatus(Long orderId, Long itemId, String artisanEmail, String newStatus) {
        return orderRepository.findById(orderId).map(order -> {
            boolean allItemsSentOrReceived = true;

            for (OrderItem item : order.getItems()) {
                if (item.getId().equals(itemId) && item.getArtisanEmail().equals(artisanEmail)) {
                    item.setStatus(newStatus);
                }

                // Check if ALL items in this order are now at least shipped to consultant
                if (!"SHIPPED_TO_CONSULTANT".equals(item.getStatus())
                        && !"RECEIVED_BY_CONSULTANT".equals(item.getStatus())) {
                    allItemsSentOrReceived = false;
                }
            }

            // If an artisan ships an item, and now ALL items are at the consultant hub,
            // update main order status
            if (allItemsSentOrReceived && "PENDING".equals(order.getStatus())) {
                order.setStatus("PROCESSING");
            }

            return orderRepository.save(order);
        });
    }
}
