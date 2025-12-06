"use client";

// Mock data - replace with real Stripe/Paddle API calls later
const revenueMetrics = [
  { label: 'Monthly Recurring Revenue', value: '$12,847', change: '+15.3%', trend: 'up' },
  { label: 'Annual Recurring Revenue', value: '$154,164', change: '+18.2%', trend: 'up' },
  { label: 'Average Revenue Per User', value: '$45.12', change: '+5.8%', trend: 'up' },
  { label: 'Customer Lifetime Value', value: '$542', change: '+12.1%', trend: 'up' },
];

const planBreakdown = [
  { plan: 'Pro', subscribers: 156, revenue: '$7,800', percentage: 60.7 },
  { plan: 'Starter', subscribers: 312, revenue: '$4,680', percentage: 36.4 },
  { plan: 'Free', subscribers: 2379, revenue: '$0', percentage: 0 },
];

const recentTransactions = [
  { id: 1, user: 'Kleima Home', email: 'hello@kleimahome.com', amount: '$50.00', plan: 'Pro', date: '2024-12-06', status: 'Completed' },
  { id: 2, user: 'Fashion Forward', email: 'contact@fashionforward.com', amount: '$50.00', plan: 'Pro', date: '2024-12-05', status: 'Completed' },
  { id: 3, user: 'TechFlow Agency', email: 'team@techflow.io', amount: '$15.00', plan: 'Starter', date: '2024-12-05', status: 'Completed' },
  { id: 4, user: 'Green Garden Shop', email: 'support@greengarden.com', amount: '$15.00', plan: 'Starter', date: '2024-12-04', status: 'Refunded' },
  { id: 5, user: 'Perfect U Cosmetics', email: 'info@perfectu.com', amount: '$15.00', plan: 'Starter', date: '2024-12-04', status: 'Completed' },
];

const monthlyRevenue = [
  { month: 'Jul', revenue: 8500 },
  { month: 'Aug', revenue: 9200 },
  { month: 'Sep', revenue: 9800 },
  { month: 'Oct', revenue: 10500 },
  { month: 'Nov', revenue: 11600 },
  { month: 'Dec', revenue: 12847 },
];

export default function RevenuePage() {
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
        <p className="text-gray-600 mt-1">MRR, subscriptions, and billing performance.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{metric.label}</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  metric.trend === 'up'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyRevenue.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${(month.revenue / maxRevenue) * 200}px` }}
                  title={`$${month.revenue.toLocaleString()}`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Plan</h3>
          <div className="space-y-4">
            {planBreakdown.map((plan, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        plan.plan === 'Pro'
                          ? 'bg-purple-100 text-purple-700'
                          : plan.plan === 'Starter'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {plan.plan}
                    </span>
                    <span className="text-sm text-gray-600">{plan.subscribers} subscribers</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{plan.revenue}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      plan.plan === 'Pro'
                        ? 'bg-purple-500'
                        : plan.plan === 'Starter'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total MRR</span>
              <span className="text-xl font-bold text-gray-900">$12,480</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Plan
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.user}</p>
                      <p className="text-xs text-gray-500">{transaction.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{transaction.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        transaction.plan === 'Pro'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {transaction.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Payment Integration</h4>
            <p className="text-sm text-blue-700">
              Connect your Stripe or Paddle account to see real-time revenue data, subscription metrics, and transaction history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
