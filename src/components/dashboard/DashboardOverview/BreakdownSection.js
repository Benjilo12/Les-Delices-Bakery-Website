export default function BreakdownSection({ stats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          💳 Payment Status
        </h2>
        <div className="space-y-3">
          {Object.entries(stats?.paymentBreakdown || {}).map(
            ([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {status}
                </span>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          🚚 Delivery Method
        </h2>
        <div className="space-y-3">
          {Object.entries(stats?.deliveryMethodBreakdown || {}).map(
            ([method, count]) => (
              <div
                key={method}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {method}
                </span>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
