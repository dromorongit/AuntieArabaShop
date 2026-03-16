import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/auth';
import type { Order, Product, DashboardStats, TopSellingProduct } from '@/types';

// GET dashboard statistics
export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const productsCollection = db.collection<Product>('products');

    // Get total orders
    const totalOrders = await ordersCollection.countDocuments();

    // Get total revenue (from completed orders)
    const revenueResult = await ordersCollection.aggregate([
      {
        $match: { status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]).toArray();
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get total products
    const totalProducts = await productsCollection.countDocuments();

    // Get unique customers (by phone)
    const customersResult = await ordersCollection.distinct('phone');
    const totalCustomers = customersResult.length;

    // Get pending orders
    const pendingOrders = await ordersCollection.countDocuments({ status: 'pending' });

    // Get low stock products (stock < 5)
    const lowStockProducts = await productsCollection.countDocuments({
      $or: [
        { stock: { $lt: 5, $gt: 0 } },
        { variants: { $elemMatch: { stock: { $lt: 5, $gt: 0 } } } }
      ]
    });

    // Get recent orders (last 10)
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get top selling products
    const topSellingResult = await ordersCollection.aggregate([
      { $unwind: '$products' },
      { $match: { status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] } } },
      {
        $group: {
          _id: '$products.productId',
          productName: { $first: '$products.productName' },
          productImage: { $first: '$products.productImage' },
          totalSold: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]).toArray();

    const topSellingProducts = topSellingResult.map((item) => ({
      productId: item._id as string,
      productName: item.productName,
      image: item.productImage,
      totalSold: item.totalSold,
      revenue: item.revenue,
    }));

    // Orders by status
    const ordersByStatus = await ordersCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Orders by payment method
    const ordersByPayment = await ordersCollection.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Daily orders for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyOrders = await ordersCollection.aggregate([
      {
        $match: { createdAt: { $gte: thirtyDaysAgo } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const stats: DashboardStats = {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
    };

    return NextResponse.json({
      stats,
      recentOrders,
      topSellingProducts,
      ordersByStatus,
      ordersByPayment,
      dailyOrders,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
