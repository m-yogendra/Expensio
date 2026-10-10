package com.mytracker.backend.ai.tools;

import com.mytracker.backend.entity.Expense;
import com.mytracker.backend.repository.ExpenseRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExpenseChatTools {

    private final ExpenseRepository expenseRepository;

    public ExpenseChatTools(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Tool(description = "Get expenses between start date and end date. Date format: yyyy-MM-dd.")
    public String getExpensesByDateRange(String startDate, String endDate) {
        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);
        List<Expense> expenses = expenseRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
        if (expenses.isEmpty()) {
            return "No expenses found in that date range.";
        }
        return expenses.stream()
                .limit(20)
                .map(e -> e.getCreatedAt().toLocalDate() + " | " + e.getName() + " | " + e.getAmount() + " | " + safe(e.getNotes()))
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = "Get total spend for a given month. Inputs: year and month number (1-12).")
    public String getMonthlySpend(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);
        BigDecimal total = expenseRepository.sumAmountBetween(start, end);
        return "Total spend for " + ym + " is Rs." + total;
    }

    @Tool(description = "Get top 5 highest single expenses overall.")
    public String getTopExpenses() {
        List<Expense> top = expenseRepository.findTop5ByOrderByAmountDesc();
        if (top.isEmpty()) {
            return "No expenses found.";
        }
        return top.stream()
                .map(e -> e.getCreatedAt().toLocalDate() + " | " + e.getName() + " | " + e.getAmount())
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = "Search expense records by keyword in expense name, latest first.")
    public String searchExpensesByKeyword(String keyword) {
        List<Expense> items = expenseRepository.findTop10ByNameContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
        if (items.isEmpty()) {
            return "No matching expenses found for keyword: " + keyword;
        }
        return items.stream()
                .map(e -> e.getCreatedAt().toLocalDate() + " | " + e.getName() + " | " + e.getAmount() + " | " + safe(e.getNotes()))
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = "Get total spending from start date to end date. Date format: yyyy-MM-dd.")
    public String getSpendTotalByDateRange(String startDate, String endDate) {
        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);
        BigDecimal total = expenseRepository.sumAmountBetween(start, end);
        return "Total spend from " + startDate + " to " + endDate + " is Rs." + total;
    }

    private String safe(String notes) {
        return notes == null || notes.isBlank() ? "-" : notes;
    }
}
