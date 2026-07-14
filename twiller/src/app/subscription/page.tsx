"use client";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const { user }: any = useAuth();

  const plans = [
    {
      name: "Free",
      amount: 0,
      price: "₹0",
      limit: "1 Tweet / Day",
    },
    {
      name: "Bronze",
      amount: 100,
      price: "₹100",
      limit: "3 Tweets / Day",
    },
    {
      name: "Silver",
      amount: 300,
      price: "₹300",
      limit: "5 Tweets / Day",
    },
    {
      name: "Gold",
      amount: 1000,
      price: "₹1000",
      limit: "Unlimited Tweets",
    },
  ];

  const handlePayment = async (
    plan: string,
    amount: number
  ) => {
    const currentTime = new Date();

const indiaTime = new Date(
  currentTime.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  })
);

const hour = indiaTime.getHours();

if (hour < 10 || hour >= 11) {
  alert("Payments are allowed only between 10:00 AM and 11:00 AM IST.");
  return;
}
    try {
      // Free plan doesn't need payment
      if (amount === 0) {
        const res = await axiosInstance.post(
          "/upgrade-subscription",
          {
            email: user.email,
            plan,
          }
        );

        alert(res.data.message);
        return;
      }

      // Create Razorpay Order
      const { data: order } =
        await axiosInstance.post("/create-order", {
          amount,
        });

      const options = {
        key: "rzp_test_TBhLNhfOUjcIwl", 

        amount: order.amount,

        currency: order.currency,

        name: "Twiller Premium",

        description: `${plan} Subscription`,

        order_id: order.id,

       handler: async function (response: any) {

  // Upgrade subscription
  const res = await axiosInstance.post(
    "/upgrade-subscription",
    {
      email: user.email,
      plan,
    }
  );

  // Save payment in MongoDB
  await axiosInstance.post("/save-payment", {
    email: user.email,
    plan,
    amount,
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
  });

await axiosInstance.post("/send-invoice", {
  email: user.email,
  plan,
  amount,
}); 

  alert(res.data.message);
},


prefill: {
          name: user.displayName,
          email: user.email,
        },

        theme: {
          color: "#1DA1F2",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-black via-[#08152b] to-black text-white flex flex-col items-center px-8 py-14">
<h1 className="mb-12 bg-gradient-to-r from-[#1D9BF0] to-cyan-300 bg-clip-text text-5xl font-extrabold text-transparent">        Choose Your Subscription
      </h1>

<div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (

          <div
            key={plan.name}
            className="relative w-80 rounded-3xl border border-[#2f3336] bg-gradient-to-br from-[#111827] via-[#0f172a] to-black p-8 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-[#1D9BF0] hover:shadow-blue-500/30"
>
            {plan.name === "Silver" && (
<div className="absolute -right-3 -top-3 rotate-12 rounded-full bg-yellow-400 px-5 py-2 text-xs font-bold text-black shadow-lg">
⭐ MOST POPULAR
</div>
)}
className="relative w-80 rounded-3xl border border-[#2f3336] bg-gradient-to-br from-[#111827] via-[#0f172a] to-black p-8 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-[#1D9BF0] hover:shadow-blue-500/30" 

<div className="text-center mb-4">

{plan.name === "Free" && (
<div className="text-5xl mb-2">🆓</div>
)}

{plan.name === "Bronze" && (
<div className="text-5xl mb-2">🥉</div>
)}

{plan.name === "Silver" && (
<div className="text-5xl mb-2">🥈</div>
)}

{plan.name === "Gold" && (
<div className="text-5xl mb-2">👑</div>
)}

<h2 className="text-center text-3xl font-extrabold tracking-wide">
{plan.name}
</h2>

</div>

<p className="mt-5 text-center text-5xl font-black text-[#1D9BF0]">              {plan.price}
            </p>

<p className="mt-5 text-center text-lg text-gray-300">              {plan.limit}
            </p>

            <button
              onClick={() =>
                handlePayment(plan.name, plan.amount)
              }
className="mt-8 w-full rounded-full bg-[#1D9BF0] py-4 text-lg font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-[#1484d6]"            >
              Select Plan
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

const hour = indiaTime.getHours();

if (hour < 10 || hour >= 11) {
  alert(
    "Payments are allowed only between 10:00 AM and 11:00 AM IST."
  );
}