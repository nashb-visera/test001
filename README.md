# Company Network Monitoring Platform

This repository sketches a full-stack platform for scheduled and ad-hoc network health checks across company computers.

## Overview
- **Backend:** Spring Boot 3 + Oracle DB (Druid pool) + MyBatis-Plus, Log4j2 logging, scheduled ping sweeps every 5 minutes, email alerts for anomalies, packaged via Docker.
- **Frontend:** React 18 + MUI v5 with global theming, on-demand IP ping tester page, Dockerized static build.

## Contents
- `backend/` — Spring Boot scaffold (scheduling, ping service, REST endpoint, Oracle/Druid/mail config samples, Dockerfile).
- `frontend/` — React + MUI theming guidance, Ping tester UI sample, Dockerfile.

See the `backend/README.md` and `frontend/README.md` for implementation details, configuration, and next steps.
