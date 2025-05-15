import { performance } from 'perf_hooks';

const performanceMiddleware = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.originalUrl} took ${duration.toFixed(2)}ms`);
  });

  next();
};

export default performanceMiddleware;