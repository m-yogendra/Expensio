package com.mytracker.backend.service;

import com.mytracker.backend.entity.Expense;
import com.mytracker.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
