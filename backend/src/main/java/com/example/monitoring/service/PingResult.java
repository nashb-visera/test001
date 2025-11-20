package com.example.monitoring.service;

import java.time.Instant;

public record PingResult(String ip, boolean reachable, long durationMs, Instant checkedAt) {}
