const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({
  app: 'jobify-backend',
  prefix: 'jobify_',
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register,
});

// ─── Custom Metrics ─────────────────────────────────────────────────────────

// HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'jobify_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

// Total HTTP requests counter
const httpRequestTotal = new client.Counter({
  name: 'jobify_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Active connections gauge
const activeConnections = new client.Gauge({
  name: 'jobify_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

// ─── Middleware ──────────────────────────────────────────────────────────────

/**
 * Express middleware that records HTTP request duration and count.
 * Attach BEFORE routes: app.use(metricsMiddleware)
 */
const metricsMiddleware = (req, res, next) => {
  // Skip recording metrics for the /metrics endpoint itself
  if (req.path === '/metrics') return next();

  const end = httpRequestDuration.startTimer();
  activeConnections.inc();

  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };
    end(labels);
    httpRequestTotal.inc(labels);
    activeConnections.dec();
  });

  next();
};

module.exports = { register, metricsMiddleware, httpRequestDuration, httpRequestTotal };
