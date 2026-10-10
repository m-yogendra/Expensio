package com.mytracker.backend.ai.service;

import com.mytracker.backend.ai.tools.ExpenseChatTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final ExpenseChatTools expenseChatTools;

    public ChatService(ChatClient.Builder chatClientBuilder, ExpenseChatTools expenseChatTools) {
        this.chatClient = chatClientBuilder.build();
        this.expenseChatTools = expenseChatTools;
    }

    public String ask(String userMessage) {
        return chatClient.prompt()
                .system("""
                        You are an expense assistant for MyTracker.
                        Always use available tools for any numeric or date-based expense answer.
                        Keep responses short, clear, and practical.
                        If data is unavailable, clearly say so.
                        Currency is Indian Rupees (Rs.).
                        """)
                .user(userMessage)
                .tools(expenseChatTools)
                .call()
                .content();
    }
}
