import express from 'express';
import { validateCoupon, recordCouponUsage } from '../controllers/couponController.js';

const router = express.Router();

// Validate coupon
router.post('/validate', validateCoupon);

// Record coupon usage
router.post('/record-usage', recordCouponUsage);

export default router;

