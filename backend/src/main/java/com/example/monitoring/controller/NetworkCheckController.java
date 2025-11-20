package com.example.monitoring.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitoring.service.PingResult;
import com.example.monitoring.service.PingService;

@RestController
@RequestMapping("/api/network")
public class NetworkCheckController {

    private final PingService pingService;

    public NetworkCheckController(PingService pingService) {
        this.pingService = pingService;
    }

    @PostMapping("/check")
    public List<PingResult> check(@RequestBody List<String> ips) {
        return ips.stream()
                .map(pingService::ping)
                .toList();
    }
}
