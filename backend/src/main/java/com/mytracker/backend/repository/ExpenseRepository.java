package com.mytracker.backend.repository;

import com.mytracker.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByOrderByCreatedAtDesc();

    List<Expense> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    List<Expense> findTop5ByOrderByAmountDesc();

    List<Expense> findTop10ByNameContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

    @Query("select coalesce(sum(e.amount), 0) from Expense e where e.createdAt between :start and :end")
    BigDecimal sumAmountBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
