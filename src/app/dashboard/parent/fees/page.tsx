'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface FeeRecord {
  id: string;
  type: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  paidDate: string | null;
  paidAmount: number | null;
  paymentMethod: string | null;
}

interface FeesData {
  fees: FeeRecord[];
  summary: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  studentName: string;
}

export default function ParentFeesPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FeesData | null>(null);

  useEffect(() => {
    fetchFeesData();
  }, []);

  const fetchFeesData = async () => {
    try {
      const response = await fetch('/api/parents/fees');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch fees data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'OVERDUE':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'PARTIAL':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'WAIVED':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PARTIAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WAIVED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No fees data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fees & Payments</h1>
        <p className="text-gray-600 mt-1">{data.studentName}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Fees</p>
            <DollarSign className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">RM {data.summary.total.toFixed(2)}</p>
        </div>

        <div className="bg-green-50 rounded-lg shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700">Paid</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">RM {data.summary.paid.toFixed(2)}</p>
        </div>

        <div className="bg-orange-50 rounded-lg shadow-md p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-orange-700">Pending</p>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900">RM {data.summary.pending.toFixed(2)}</p>
        </div>

        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-red-700">Overdue</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-900">RM {data.summary.overdue.toFixed(2)}</p>
        </div>
      </div>

      {/* Fee Records */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
            Payment History
          </h2>
        </div>
        <div className="divide-y">
          {data.fees.length > 0 ? (
            data.fees.map((fee) => {
              const balance = fee.amount - (fee.paidAmount || 0);
              return (
                <div key={fee.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(fee.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{fee.description}</h3>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                            {fee.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium text-gray-900">RM {fee.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          {fee.paidAmount !== null && (
                            <>
                              <div>
                                <p className="text-gray-500">Paid Amount</p>
                                <p className="font-medium text-green-700">RM {fee.paidAmount.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Paid Date</p>
                                <p className="font-medium text-gray-900">
                                  {fee.paidDate
                                    ? new Date(fee.paidDate).toLocaleDateString()
                                    : '-'}
                                </p>
                              </div>
                            </>
                          )}
                          {balance > 0 && fee.status !== 'PAID' && (
                            <div>
                              <p className="text-gray-500">Balance</p>
                              <p className="font-medium text-orange-700">RM {balance.toFixed(2)}</p>
                            </div>
                          )}
                          {fee.paymentMethod && (
                            <div>
                              <p className="text-gray-500">Payment Method</p>
                              <p className="font-medium text-gray-900">{fee.paymentMethod}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        fee.status
                      )}`}
                    >
                      {fee.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">No fee records found</div>
          )}
        </div>
      </div>

      {data.summary.overdue > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Payment Overdue</h4>
              <p className="text-sm text-red-700 mt-1">
                You have RM {data.summary.overdue.toFixed(2)} in overdue payments. Please contact
                the administration to arrange payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
