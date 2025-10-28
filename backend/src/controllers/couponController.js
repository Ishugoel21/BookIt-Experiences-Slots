import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

// Validate coupon code
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || !subtotal) {
      return res.status(400).json({
        valid: false,
        error: 'Code and subtotal are required'
      });
    }

    const db = getDB();
    const couponsCollection = db.collection('coupons');

    // Find the coupon
    const coupon = await couponsCollection.findOne({
      code: code.toUpperCase(),
      is_active: true
    });

    if (!coupon) {
      return res.status(200).json({
        valid: false,
        error: 'Invalid or inactive coupon code'
      });
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(200).json({
        valid: false,
        error: 'This coupon has expired'
      });
    }

    // Check usage limits
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return res.status(200).json({
        valid: false,
        error: 'This coupon has reached its usage limit'
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round(subtotal * (coupon.discount_value / 100));
    } else {
      discount = Math.min(coupon.discount_value, subtotal);
    }

    console.log(`Coupon ${code} validated successfully. Discount: ${discount}`);

    return res.status(200).json({
      valid: true,
      discount,
      couponId: coupon._id.toString(),
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({
      valid: false,
      error: error.message
    });
  }
};

// Record coupon usage
export const recordCouponUsage = async (req, res) => {
  try {
    const { couponId, email } = req.body;

    if (!couponId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Coupon ID and email are required'
      });
    }

    const db = getDB();
    const usageCollection = db.collection('coupon_usage');
    const couponsCollection = db.collection('coupons');

    // Convert couponId to ObjectId and validate
    let couponObjectId;
    try {
      couponObjectId = new ObjectId(couponId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coupon ID format'
      });
    }

    // Record the usage
    await usageCollection.insertOne({
      coupon_id: couponObjectId,
      email: email,
      used_at: new Date()
    });

    // Increment the current_uses counter
    await couponsCollection.updateOne(
      { _id: couponObjectId },
      { $inc: { current_uses: 1 }, $set: { updated_at: new Date() } }
    );

    console.log(`Coupon usage recorded for ${email}`);

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error recording coupon usage:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

