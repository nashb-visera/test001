# Monitoring Platform Backend (Spring Boot)

This document outlines a Spring Boot 3.x backend that periodically checks internal workstation connectivity and exposes APIs to trigger on-demand pings. Key requirements:

- **Oracle Database** with connection pooling via **Druid** and ORM using **MyBatis-Plus**.
- **Log4j2** for structured logging.
- **Spring Scheduler** triggers network checks every 5 minutes.
- **Mail alerts** automatically sent to the system owner when anomalies are detected.
- **Dockerized** deployment.

## Project Structure
```
backend/
 ├─ src/main/java/com/example/monitoring/
 │   ├─ MonitoringApplication.java        # Spring Boot entry point
 │   ├─ config/
 │   │   ├─ DataSourceConfig.java         # Oracle + Druid setup
 │   │   ├─ MyBatisPlusConfig.java        # Mapper scanning & pagination
 │   │   ├─ MailConfig.java               # SMTP credentials (ENV-based)
 │   │   └─ SchedulerConfig.java          # 5-minute cron scheduling
 │   ├─ domain/
 │   │   ├─ entity/ComputerHost.java
 │   │   ├─ mapper/ComputerHostMapper.java
 │   │   └─ service/ComputerHostService.java
 │   ├─ service/PingService.java          # ICMP/exec ping wrapper
 │   ├─ service/MonitoringJob.java        # Scheduled network sweep
 │   └─ controller/NetworkCheckController.java # REST endpoint for ad-hoc tests
 ├─ src/main/resources/
 │   ├─ application.yml                   # Oracle, mail, scheduler, logging
 │   └─ log4j2-spring.xml                 # JSON console & rolling file
 ├─ pom.xml                               # Spring Boot starter, MyBatis-Plus, Oracle, Druid, mail
 └─ Dockerfile                            # Multi-stage build
```

## Core Behaviors
- **Scheduled sweep**: `MonitoringJob` loads active hosts from Oracle (via `ComputerHostMapper`), executes ping using `PingService`, persists results, and triggers email alerts when a host fails consecutive checks.
- **Manual trigger**: `NetworkCheckController` exposes `POST /api/network/check` accepting one or more IPs. It immediately returns ping results and saves them.
- **Alerting**: `MailConfig` wires Spring Mail with credentials from env variables (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_TO`). Alerts include failed host, timestamp, and recent history link.

## Configuration Highlights
- `application.yml` defines:
  - Oracle URL: `${ORACLE_URL}` (e.g., `jdbc:oracle:thin:@//db-host:1521/ORCLCDB`)
  - Credentials: `${ORACLE_USER}` / `${ORACLE_PASSWORD}`
  - Druid tuning: `initial-size`, `max-active`, `validation-query: SELECT 1 FROM DUAL`
  - Scheduler: `fixed-delay: 5m`
  - Logging: log4j2 JSON console + rolling file at `/var/log/monitoring/app.log`.
- `log4j2-spring.xml` enables async appenders and markers for network checks and alert events.

## Dockerization
- **Multi-stage** build: `maven:3-eclipse-temurin-17` builder, `eclipse-temurin:17-jre` runtime.
- Runtime env variables: `ORACLE_URL`, `ORACLE_USER`, `ORACLE_PASSWORD`, `MAIL_*`, `ALERT_THRESHOLD`.
- Healthcheck: `CMD curl -f http://localhost:8080/actuator/health || exit 1`.

## Sample Scheduler Configuration (SchedulerConfig.java)
```java
@Configuration
@EnableScheduling
public class SchedulerConfig {
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("net-check-");
        return scheduler;
    }
}
```

## Sample Ping Service (PingService.java)
```java
@Service
@Slf4j
public class PingService {
    public PingResult ping(String ip) {
        Instant startedAt = Instant.now();
        int exitCode = new ProcessBuilder("ping", "-c", "2", ip).start().waitFor();
        boolean reachable = exitCode == 0;
        long durationMs = Duration.between(startedAt, Instant.now()).toMillis();
        return new PingResult(ip, reachable, durationMs, startedAt);
    }
}
```

## REST Endpoint Example (NetworkCheckController.java)
```java
@RestController
@RequestMapping("/api/network")
@RequiredArgsConstructor
public class NetworkCheckController {
    private final PingService pingService;
    private final ComputerHostService hostService;

    @PostMapping("/check")
    public List<PingResult> check(@RequestBody List<String> ips) {
        return ips.stream()
                .map(pingService::ping)
                .peek(hostService::recordPing)
                .toList();
    }
}
```

## Email Alert Flow
1. `MonitoringJob` aggregates failures across the last N checks.
2. If a host exceeds `ALERT_THRESHOLD` consecutive failures, compose an email with summary and logs URL.
3. Send via Spring Mail; log with `ALERT` marker.

## Local Development
```bash
# Build
./mvnw clean package
# Run
ORACLE_URL=... ORACLE_USER=... ORACLE_PASSWORD=... MAIL_HOST=... ./mvnw spring-boot:run
```

## Next Steps
- Implement database migration scripts for host inventory and ping history.
- Harden ping implementation for Windows clients (fallback to `-n`).
- Add actuator metrics for ping latency distribution and alert counts.
```
