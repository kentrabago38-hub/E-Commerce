import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
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

// Ensure directories for permanent file & upload storage exist
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'public/images/uploads');
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, 'public/images');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Disk persistence file paths
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

function loadJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T;
      }
    }
  } catch (err) {
    console.warn(`[Storage] Failed to read ${filePath}:`, err);
  }
  return fallback;
}

function saveJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Storage] Failed to write ${filePath}:`, err);
  }
}

// Resilient storage initialized from persisted disk files, falling back to INITIAL_*
let inMemoryProducts = loadJsonFile(PRODUCTS_FILE, [...INITIAL_PRODUCTS]);
let inMemoryCategories = loadJsonFile(CATEGORIES_FILE, [...INITIAL_CATEGORIES]);
let inMemoryOrders = loadJsonFile(ORDERS_FILE, [...INITIAL_ORDERS]);
let inMemoryUsers = loadJsonFile(USERS_FILE, [...INITIAL_REGISTERED_USERS]);
let inMemoryReviews = loadJsonFile(REVIEWS_FILE, [...INITIAL_REVIEWS]);

// If files did not exist, write initial data to disk
if (!fs.existsSync(PRODUCTS_FILE)) saveJsonFile(PRODUCTS_FILE, inMemoryProducts);
if (!fs.existsSync(CATEGORIES_FILE)) saveJsonFile(CATEGORIES_FILE, inMemoryCategories);
if (!fs.existsSync(ORDERS_FILE)) saveJsonFile(ORDERS_FILE, inMemoryOrders);
if (!fs.existsSync(USERS_FILE)) saveJsonFile(USERS_FILE, inMemoryUsers);
if (!fs.existsSync(REVIEWS_FILE)) saveJsonFile(REVIEWS_FILE, inMemoryReviews);

// High limit to handle high-resolution image uploads from cameras and phones
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directly serve uploaded images and public assets
app.use('/images/uploads', express.static(UPLOADS_DIR));
app.use('/images', express.static(PUBLIC_IMAGES_DIR));

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
    }
    inMemoryProducts.unshift(req.body);
    saveJsonFile(PRODUCTS_FILE, inMemoryProducts);
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
    }
    inMemoryProducts = inMemoryProducts.map((p) => (p.product_id === req.body.product_id ? req.body : p));
    saveJsonFile(PRODUCTS_FILE, inMemoryProducts);
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
    }
    inMemoryProducts = inMemoryProducts.map((p) => (p.product_id === id ? { ...p, stock } : p));
    saveJsonFile(PRODUCTS_FILE, inMemoryProducts);
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
    }
    inMemoryProducts = inMemoryProducts.filter((p) => p.product_id !== id);
    saveJsonFile(PRODUCTS_FILE, inMemoryProducts);
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
    }
    inMemoryCategories.push(req.body);
    saveJsonFile(CATEGORIES_FILE, inMemoryCategories);
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
    }
    inMemoryCategories = inMemoryCategories.filter((c) => c.category_id !== id);
    saveJsonFile(CATEGORIES_FILE, inMemoryCategories);
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
    }
    inMemoryOrders.unshift(req.body);
    saveJsonFile(ORDERS_FILE, inMemoryOrders);
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
    }
    inMemoryOrders = inMemoryOrders.map((o) => (o.order_id === id ? { ...o, status } : o));
    saveJsonFile(ORDERS_FILE, inMemoryOrders);
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
    }
    const idx = inMemoryUsers.findIndex((u) => u.user_id === req.body.user_id || u.email === req.body.email);
    if (idx >= 0) {
      inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...req.body };
    } else {
      inMemoryUsers.push(req.body);
    }
    saveJsonFile(USERS_FILE, inMemoryUsers);
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
    }
    inMemoryReviews.unshift(req.body);
    saveJsonFile(REVIEWS_FILE, inMemoryReviews);
    res.status(201).json({ success: true, review: req.body });
  } catch (error: any) {
    console.error('API Error in POST /api/reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to insert review' });
  }
});

// 7. Dedicated Photo / Asset Upload API
app.post('/api/upload', async (req: Request, res: Response) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'No image data provided. Expected base64 string or data URL.' });
    }

    // Parse Data URL format or raw base64
    let ext = 'jpg';
    let base64Data = image;
    const matches = image.match(/^data:image\/([A-Za-z0-9-+]+);base64,(.+)$/);

    if (matches && matches.length === 3) {
      const subType = matches[1].toLowerCase();
      if (subType.includes('png')) ext = 'png';
      else if (subType.includes('webp')) ext = 'webp';
      else if (subType.includes('gif')) ext = 'gif';
      else if (subType.includes('svg')) ext = 'svg';
      else ext = 'jpg';
      base64Data = matches[2];
    } else if (image.startsWith('data:')) {
      const genericMatch = image.match(/^data:[^;]+;base64,(.+)$/);
      if (genericMatch) base64Data = genericMatch[1];
    }

    const cleanName = filename
      ? filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32)
      : 'wine_upload';
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).slice(2, 7);
    const finalFilename = `${cleanName}_${timestamp}_${randomHex}.${ext}`;
    const targetFilePath = path.join(UPLOADS_DIR, finalFilename);

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(targetFilePath, buffer);

    // Also mirror to dist if dist/images/uploads exists
    const distUploads = path.resolve(__dirname, 'dist/images/uploads');
    if (fs.existsSync(distUploads)) {
      try {
        fs.writeFileSync(path.join(distUploads, finalFilename), buffer);
      } catch {}
    }

    const publicUrl = `/images/uploads/${finalFilename}`;
    console.log(`[Upload API] Saved photo: ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      sizeBytes: buffer.length
    });
  } catch (error: any) {
    console.error('API Error in POST /api/upload:', error);
    res.status(500).json({ error: error.message || 'Failed to process and store image upload' });
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
