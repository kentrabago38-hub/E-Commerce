import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import {
  getAllProducts,
  insertProduct,
  updateProductRecord,
  updateStockRecord,
  deleteProductRecord,
  getAllCategories,
  insertCategory,
  deleteCategoryRecord,
  getAllOrders,
  insertOrder,
  updateOrderStatusRecord,
  getAllUsers,
  upsertUserRecord,
  getAllReviews,
  insertReviewRecord
} from './src/db/queries';
import { seedPostgresIfEmpty } from './src/db/seedPostgres';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REGISTERED_USERS
} from './src/data/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine port: prioritize --port CLI argument or default strictly to 3000.
// Cloud Run injects PORT=8080 into process.env which is reserved for the platform proxy.
function getListenPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const val = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return 3000;
}

const PORT = getListenPort();
const isProduction = process.env.NODE_ENV === 'production';
const hasPostgres = Boolean(process.env.SQL_HOST);

// Resilient in-memory storage when PostgreSQL is not configured
let inMemoryProducts = [...INITIAL_PRODUCTS];
let inMemoryCategories = [...INITIAL_CATEGORIES];
let inMemoryOrders = [...INITIAL_ORDERS];
let inMemoryUsers = [...INITIAL_REGISTERED_USERS];
let inMemoryReviews = [...INITIAL_REVIEWS];

app.use(express.json({ limit: '10mb' }));

// 1. Health check endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: hasPostgres ? 'postgresql' : 'in-memory',
    timestamp: new Date().toISOString()
  });
});

// 2. Products API
app.get('/api/products', async (_req: Request, res: Response) => {
  if (hasPostgres) {
    try {
      const list = await getAllProducts();
      return res.json(list);
    } catch (error: any) {
      console.warn('Postgres query failed, falling back to in-memory store:', error.message);
    }
  }
  res.json(inMemoryProducts);
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    if (hasPostgres) {
      await insertProduct(req.body);
    } else {
      inMemoryProducts.push(req.body);
    }
    res.status(201).json({ success: true, product: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/products:', error);
    res.status(500).json({ error: error.message || 'Failed to insert product' });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    if (hasPostgres) {
      await updateProductRecord(req.body);
    } else {
      inMemoryProducts = inMemoryProducts.map((p) => (p.product_id === req.body.product_id ? req.body : p));
    }
    res.json({ success: true, product: req.body });
  } catch (error: any) {
    console.error('API Error in PUT /api/products/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

app.patch('/api/products/:id/stock', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (hasPostgres) {
      await updateStockRecord(id, stock);
    } else {
      inMemoryProducts = inMemoryProducts.map((p) => (p.product_id === id ? { ...p, stock } : p));
    }
    res.json({ success: true, productId: id, stock });
  } catch (error: any) {
    console.error('API Error in PATCH /api/products/:id/stock:', error);
    res.status(500).json({ error: error.message || 'Failed to update stock' });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (hasPostgres) {
      await deleteProductRecord(id);
    } else {
      inMemoryProducts = inMemoryProducts.filter((p) => p.product_id !== id);
    }
    res.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/products/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// 3. Categories API
app.get('/api/categories', async (_req: Request, res: Response) => {
  if (hasPostgres) {
    try {
      const list = await getAllCategories();
      return res.json(list);
    } catch (error: any) {
      console.warn('Postgres query failed, falling back to in-memory categories:', error.message);
    }
  }
  res.json(inMemoryCategories);
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    if (hasPostgres) {
      await insertCategory(req.body);
    } else {
      inMemoryCategories.push(req.body);
    }
    res.status(201).json({ success: true, category: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/categories:', error);
    res.status(500).json({ error: error.message || 'Failed to insert category' });
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (hasPostgres) {
      await deleteCategoryRecord(id);
    } else {
      inMemoryCategories = inMemoryCategories.filter((c) => c.category_id !== id);
    }
    res.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/categories/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to delete category' });
  }
});

// 4. Orders API
app.get('/api/orders', async (_req: Request, res: Response) => {
  if (hasPostgres) {
    try {
      const list = await getAllOrders();
      return res.json(list);
    } catch (error: any) {
      console.warn('Postgres query failed, falling back to in-memory orders:', error.message);
    }
  }
  res.json(inMemoryOrders);
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    if (hasPostgres) {
      await insertOrder(req.body);
    } else {
      inMemoryOrders.unshift(req.body);
    }
    res.status(201).json({ success: true, order: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/orders:', error);
    res.status(500).json({ error: error.message || 'Failed to insert order' });
  }
});

app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (hasPostgres) {
      await updateOrderStatusRecord(id, status);
    } else {
      inMemoryOrders = inMemoryOrders.map((o) => (o.order_id === id ? { ...o, status } : o));
    }
    res.json({ success: true, orderId: id, status });
  } catch (error: any) {
    console.error('API Error in PATCH /api/orders/:id/status:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});

// 5. Users API
app.get('/api/users', async (_req: Request, res: Response) => {
  if (hasPostgres) {
    try {
      const list = await getAllUsers();
      return res.json(list);
    } catch (error: any) {
      console.warn('Postgres query failed, falling back to in-memory users:', error.message);
    }
  }
  res.json(inMemoryUsers);
});

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    if (hasPostgres) {
      await upsertUserRecord(req.body);
    } else {
      const idx = inMemoryUsers.findIndex((u) => u.user_id === req.body.user_id || u.email === req.body.email);
      if (idx >= 0) {
        inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...req.body };
      } else {
        inMemoryUsers.push(req.body);
      }
    }
    res.json({ success: true, user: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/users:', error);
    res.status(500).json({ error: error.message || 'Failed to upsert user' });
  }
});

// 6. Reviews API
app.get('/api/reviews', async (_req: Request, res: Response) => {
  if (hasPostgres) {
    try {
      const list = await getAllReviews();
      return res.json(list);
    } catch (error: any) {
      console.warn('Postgres query failed, falling back to in-memory reviews:', error.message);
    }
  }
  res.json(inMemoryReviews);
});

app.post('/api/reviews', async (req: Request, res: Response) => {
  try {
    if (hasPostgres) {
      await insertReviewRecord(req.body);
    } else {
      inMemoryReviews.unshift(req.body);
    }
    res.status(201).json({ success: true, review: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to insert review' });
  }
});

// Initial database seeding if empty
if (hasPostgres) {
  seedPostgresIfEmpty().catch((err) => {
    console.warn('Initial seeding note:', err);
  });
}

// 7. Mount Vite in dev mode or serve static files in prod
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`VÍNEA Full-Stack Server running on http://0.0.0.0:${PORT} (${hasPostgres ? 'PostgreSQL' : 'In-Memory/Resilient'} backend).`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use.`);
  } else {
    console.error('Server error:', err);
  }
});
