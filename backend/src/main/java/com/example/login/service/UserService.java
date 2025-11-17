package com.example.login.service;

import com.example.login.entity.User;

public interface UserService {
    User authenticate(String username, String rawPassword);
}
