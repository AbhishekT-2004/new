import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { COUPONS } from './src/data/mockProducts.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(express.json());

  // API Logging & CORS header for development
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // --- API Endpoints ---

  // Health check & DB connection status
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      engine: 'Node.js Express + MongoDB-compatible Schema Store',
      mongoUriConfigured: Boolean(process.env.MONGODB_URI),
      timestamp: new Date().toISOString()
    });
  });

  // Products
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const { category, search, inStock } = req.query;
      const products = db.getProducts({
        category: category as string,
        search: search as string,
        inStock: inStock === 'true'
      });
      res.json({ success: true, count: products.length, data: products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    try {
      const product = db.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, data: product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const newProduct = db.createProduct(req.body);
      res.status(201).json({ success: true, data: newProduct });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Orders
  app.get('/api/orders', (req: Request, res: Response) => {
    try {
      const orders = db.getOrders();
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/orders/:idOrTracking', (req: Request, res: Response) => {
    try {
      const order = db.getOrderByIdOrTracking(req.params.idOrTracking);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order or Tracking ID not found' });
      }
      res.json({ success: true, data: order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const { items, shippingAddress, paymentMethod, subtotal, discount, couponCode, couponDiscount, deliveryFee, totalAmount, expectedDeliveryDate } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart cannot be empty' });
      }
      if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode) {
        return res.status(400).json({ success: false, message: 'Shipping address is incomplete' });
      }

      const order = db.createOrder({
        items,
        shippingAddress,
        paymentMethod: paymentMethod || 'CARD',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        status: 'PLACED',
        subtotal,
        discount: discount || 0,
        couponCode,
        couponDiscount: couponDiscount || 0,
        deliveryFee: deliveryFee || 0,
        totalAmount,
        expectedDeliveryDate: expectedDeliveryDate || '3-5 Business Days'
      });

      res.status(201).json({ success: true, data: order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    try {
      const { status, note } = req.body;
      const updated = db.updateOrderStatus(req.params.id, status, note);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
    try {
      const order = db.getOrderByIdOrTracking(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      if (order.status === 'DELIVERED') {
        return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled. Please initiate a return.' });
      }
      const updated = db.updateOrderStatus(order.id, 'CANCELLED', 'Order cancelled by customer');
      res.json({ success: true, message: 'Order cancelled successfully', data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reviews
  app.get('/api/reviews/:productId', (req: Request, res: Response) => {
    try {
      const reviews = db.getReviewsByProduct(req.params.productId);
      res.json({ success: true, count: reviews.length, data: reviews });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    try {
      const { productId, userName, rating, title, comment } = req.body;
      if (!productId || !userName || !rating || !comment) {
        return res.status(400).json({ success: false, message: 'Missing required review fields' });
      }
      const newReview = db.createReview({
        productId,
        userName,
        rating: Number(rating),
        title: title || 'Verified Purchase Review',
        comment,
        verified: true
      });
      res.status(201).json({ success: true, data: newReview });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Coupons
  app.post('/api/coupon/validate', (req: Request, res: Response) => {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }
    const foundCoupon = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!foundCoupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code. Try AURALUXE15 or FESTIVE25' });
    }
    if (cartTotal < foundCoupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of $${foundCoupon.minOrderValue} required for coupon ${foundCoupon.code}`
      });
    }

    const calculatedDiscount = Math.min(
      (cartTotal * foundCoupon.discountPercent) / 100,
      foundCoupon.maxDiscount
    );

    res.json({
      success: true,
      data: {
        code: foundCoupon.code,
        discountPercent: foundCoupon.discountPercent,
        discountAmount: Number(calculatedDiscount.toFixed(2)),
        description: foundCoupon.description
      }
    });
  });

  // Sales Analytics (Admin)
  app.get('/api/analytics', (req: Request, res: Response) => {
    try {
      const analytics = db.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Serve Frontend ---
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AuraLuxe Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
