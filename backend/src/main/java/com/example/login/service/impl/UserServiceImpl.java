package com.example.login.service.impl;

import com.example.login.entity.User;
import com.example.login.mapper.UserMapper;
import com.example.login.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public User authenticate(String username, String rawPassword) {
        User user = userMapper.findByUsername(username);
        if (user == null || Boolean.FALSE.equals(user.getActive())) {
            return null;
        }
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            return null;
        }
        user.setLastLoginAt(LocalDateTime.now());
        return user;
    }
}
