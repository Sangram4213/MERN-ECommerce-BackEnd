import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;
  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUserPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthProducts,
      lastMonthProducts,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthUsers,
      lastMonthUsers,
      userCount,
      productCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUserCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductPromise,
      lastMonthProductPromise,
      thisMonthOrderPromise,
      lastMonthOrderPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),

      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      user: userCount,
      product: productCount,
      order: allOrders.length,
    };

    const orderMonthsCounts = new Array(6).fill(0);
    const orderMonthsRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();

      if (monthDiff < 6) {
        orderMonthsCounts[6 - monthDiff - 1] += 1;
        orderMonthsRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const categoryCount = await getInventories({
      categories,
      productsCount: productCount,
    });

    const userRatio = {
      male: userCount - femaleUserCount,
      female: femaleUserCount,
    };

    const modifiedTransactions = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthsCounts,
        revenue: orderMonthsRevenue,
      },
      userRatio,
      latestTransactions: modifiedTransactions,
    };
    myCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieChart = TryCatch(async (req, res, next) => {
  let charts;

  if (myCache.has("admin-pie-chart"))
    charts = JSON.parse(myCache.get("admin-pie-chart") as string);
  else {
    const allOrderPromise = Order.find().select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      productsOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const stockAvailability = {
      outOfStock: productsOutOfStock,
      inStock: productsCount - productsOutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      marketingCost,
      burnt,
    };

    console.log(allUsers.filter((i) => i));

    const userAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 20).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      userAgeGroup,
      adminCustomer,
    };
    myCache.set("admin-pie-chart", JSON.stringify(charts));

    return res.status(200).json({
      success: true,
      charts,
    });
  }
});

export const getBarChart = TryCatch(async (req, res, next) => {});

export const getLineChart = TryCatch(async (req, res, next) => {});
