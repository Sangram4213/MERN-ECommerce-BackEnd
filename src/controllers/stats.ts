import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;
  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth()-6);

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

    const latestTransactionsPromise = Order.find({}).select(["orderItems","discount","total","status"]).limit(4)

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
      latestTransactions
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
      User.countDocuments({gender:"female"}),
      latestTransactionsPromise
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
      revenue: calculatePercentage(thisMonthRevenue,lastMonthRevenue),
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

    const revenue = allOrders.reduce((total,order)=>
      total+(order.total || 0),0
    )

    const count = {
      revenue,
      user:userCount,
      product:productCount,
      order:allOrders.length
    };

    const orderMonthsCounts = new Array(6).fill(0);
    const orderMonthsRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order)=>{
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth()-creationDate.getMonth();
      
      if(monthDiff<6){
        orderMonthsCounts[6-monthDiff-1]+=1;
        orderMonthsRevenue[6-monthDiff-1]+=order.total;
      }
    });

   const categoriesCountPromise= categories.map(category=>  Product.countDocuments({category}));
   const categoriesCount =await Promise.all(categoriesCountPromise);

   const categoryCount:Record<string,number>[] = [];

   categories.forEach((category,i)=>{
      categoryCount.push({
        [category]:Math.round((categoriesCount[i]/productCount)*100),
      })
   })

   const userRatio = {
    male : userCount-femaleUserCount,
    female:femaleUserCount
   }

   const modifiedTransactions = latestTransactions.map((i)=>({
    _id:i._id,
    discount :i.discount,
    amount:i.total,
    quantity:i.orderItems.length,
    status:i.status
   }))

    stats = {
      categoryCount,
      changePercent,
      count,
      chart:{
        order:orderMonthsCounts,
        revenue:orderMonthsRevenue
      },
      userRatio,
      latestTransactions:modifiedTransactions
    };
    myCache.set("admin-stats",JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieChart = TryCatch(async (req, res, next) => {

  
});

export const getBarChart = TryCatch(async (req, res, next) => {});

export const getLineChart = TryCatch(async (req, res, next) => {});
