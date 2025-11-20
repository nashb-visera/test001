# Monitoring Platform Frontend (React 18 + MUI)

React 18 application that consumes the backend APIs to display scheduled network health and run ad-hoc ping tests.

## Tech Stack
- React 18 with functional components and hooks
- MUI v5 with global theming via `ThemeProvider`, `createTheme`, `CssBaseline`, and `GlobalStyles`
- Axios for API calls
- Vite or CRA for bootstrapping (Vite recommended for faster builds)
- Docker for delivery

## Theming Setup
```tsx
import { CssBaseline, GlobalStyles, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#673ab7' },
    success: { main: '#2e7d32' },
    error: { main: '#d32f2f' },
  },
  shape: { borderRadius: 10 },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      body: { margin: 0, backgroundColor: '#f6f8fb' },
      a: { color: 'inherit', textDecoration: 'none' },
    }}
  />
);

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}
```

Wrap `App` with `AppProviders` in `main.tsx` so theme, baseline, and global styles apply everywhere.

## Ad-hoc IP Test Page
A new page `PingTester` allows operators to input one or more IPs and immediately see ping results:
```tsx
import { useState } from 'react';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';

export function PingTester() {
  const [ips, setIps] = useState('');
  const [results, setResults] = useState([]);

  const handleTest = async () => {
    const payload = ips.split(/[,\n\s]+/).filter(Boolean);
    const { data } = await axios.post('/api/network/check', payload);
    setResults(data);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">IP 即時連線測試</Typography>
      <TextField
        multiline
        minRows={3}
        label="輸入一個或多個 IP（逗號、換行或空白分隔）"
        value={ips}
        onChange={(e) => setIps(e.target.value)}
      />
      <Button variant="contained" onClick={handleTest}>立即測試</Button>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {results.map((item: any) => (
          <Chip
            key={item.ip}
            label={`${item.ip} - ${item.reachable ? '通' : '不通'} (${item.durationMs}ms)`}
            color={item.reachable ? 'success' : 'error'}
          />
        ))}
      </Stack>
    </Stack>
  );
}
```

Integrate the page into routing (e.g., React Router) under `/ping-tester` and include it on the dashboard.

## Scheduled Status View
- Home page shows table or cards for latest sweep results fetched from `/api/network/status`.
- Status chips use success/error colors; include latency and last-checked time.
- Provide filter/search by hostname/IP.

## Dockerfile Outline
```
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables
- `VITE_API_BASE_URL` to point Axios to the backend service (e.g., `http://backend:8080`).

## Next Steps
- Add loading states and error handling around the ping test API.
- Add charts for latency trends using MUI `LineChart` or Recharts.
- Protect the UI with SSO/JWT if required by policy.
