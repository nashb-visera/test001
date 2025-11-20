package com.example.monitoring.service;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;

import org.springframework.stereotype.Service;

@Service
public class PingService {

    public PingResult ping(String ip) {
        Instant startedAt = Instant.now();
        int exitCode;
        try {
            exitCode = new ProcessBuilder("ping", "-c", "2", ip)
                    .inheritIO()
                    .start()
                    .waitFor();
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return new PingResult(ip, false, Duration.between(startedAt, Instant.now()).toMillis(), startedAt);
        }
        boolean reachable = exitCode == 0;
        long durationMs = Duration.between(startedAt, Instant.now()).toMillis();
        return new PingResult(ip, reachable, durationMs, startedAt);
    }
}
