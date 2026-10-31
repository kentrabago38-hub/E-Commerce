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
} from './src/db/queries.ts';
import { seedPostgresIfEmpty } from './src/db/seedPostgres.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// 1. Health check endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      database: 'postgresql',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Database error' });
  }
});

// 2. Products API
app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const list = await getAllProducts();
    res.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/products:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    await insertProduct(req.body);
    res.status(201).json({ success: true, product: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/products:', error);
    res.status(500).json({ error: error.message || 'Failed to insert product' });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    await updateProductRecord(req.body);
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
    await updateStockRecord(id, stock);
    res.json({ success: true, productId: id, stock });
  } catch (error: any) {
    console.error('API Error in PATCH /api/products/:id/stock:', error);
    res.status(500).json({ error: error.message || 'Failed to update stock' });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProductRecord(id);
    res.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/products/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// 3. Categories API
app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const list = await getAllCategories();
    res.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/categories:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    await insertCategory(req.body);
    res.status(201).json({ success: true, category: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/categories:', error);
    res.status(500).json({ error: error.message || 'Failed to insert category' });
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategoryRecord(id);
    res.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error('API Error in DELETE /api/categories/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to delete category' });
  }
});

// 4. Orders API
app.get('/api/orders', async (_req: Request, res: Response) => {
  try {
    const list = await getAllOrders();
    res.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/orders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    await insertOrder(req.body);
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
    await updateOrderStatusRecord(id, status);
    res.json({ success: true, orderId: id, status });
  } catch (error: any) {
    console.error('API Error in PATCH /api/orders/:id/status:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});

// 5. Users API
app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const list = await getAllUsers();
    res.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/users:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    await upsertUserRecord(req.body);
    res.json({ success: true, user: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/users:', error);
    res.status(500).json({ error: error.message || 'Failed to upsert user' });
  }
});

// 6. Reviews API
app.get('/api/reviews', async (_req: Request, res: Response) => {
  try {
    const list = await getAllReviews();
    res.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', async (req: Request, res: Response) => {
  try {
    await insertReviewRecord(req.body);
    res.status(201).json({ success: true, review: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to insert review' });
  }
});

// Initial database seeding if empty
seedPostgresIfEmpty().catch((err) => {
  console.warn('Initial seeding note:', err);
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VÍNEA Full-Stack Server running on http://0.0.0.0:${PORT} with PostgreSQL backend.`);
});
