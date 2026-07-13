"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export default function PaymentHistory() {

  const { user }: any = useAuth();

  const [payments, setPayments] = useState([]);

  useEffect(() => {

    if (user?.email) {
      getPayments();
    }

  }, [user]);

  const getPayments = async () => {

    const res = await axiosInstance.get(
      `/payment-history/${user.email}`
    );

    setPayments(res.data);

  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        Payment History
      </h1>

      <div className="space-y-5">

        {payments.map((payment: any) => (

          <div
            key={payment._id}
            className="bg-zinc-900 p-5 rounded-lg border border-gray-700"
          >

            <h2 className="text-2xl font-bold">
              {payment.plan}
            </h2>

            <p>Amount : ₹{payment.amount}</p>

            <p>Status : {payment.status}</p>

            <p>
              Date :
              {" "}
              {new Date(
                payment.createdAt
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}