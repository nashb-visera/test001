package com.example.login.dto;

public class LoginResponse {
    private Long userId;
    private String displayName;
    private String token;

    public LoginResponse(Long userId, String displayName, String token) {
        this.userId = userId;
        this.displayName = displayName;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getToken() {
        return token;
    }
}
