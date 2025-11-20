package com.example.monitoring.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MonitoringJob {

    private final PingService pingService;

    public MonitoringJob(PingService pingService) {
        this.pingService = pingService;
    }

    @Scheduled(fixedDelayString = "PT5M")
    public void sweep() {
        // Placeholder list; in production load from Oracle via MyBatis-Plus
        List<String> ips = List.of("192.168.1.10", "192.168.1.20");
        ips.forEach(pingService::ping);
    }
}
