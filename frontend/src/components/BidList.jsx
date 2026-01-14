import { useDispatch, useSelector } from 'react-redux';

const BidList = ({ bids, loading, onHire, gigStatus }) => {
  const { user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading bids...</p>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No bids yet for this gig.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {bids.map((bid) => (
        <div
          key={bid._id}
          className={`border rounded-lg p-4 ${
            bid.status === 'hired'
              ? 'bg-green-50 border-green-200'
              : bid.status === 'rejected'
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {bid.freelancerId?.name || 'Unknown'}
              </p>
              <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">${bid.price}</p>
              <span className={`px-2 py-1 rounded text-xs ${
                bid.status === 'hired'
                  ? 'bg-green-100 text-green-800'
                  : bid.status === 'rejected'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {bid.status}
              </span>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{bid.message}</p>
          {gigStatus === 'open' && bid.status === 'pending' && (
            <button
              onClick={() => onHire(bid._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Hire This Freelancer
            </button>
          )}
          {bid.status === 'hired' && (
            <p className="text-green-700 font-medium text-sm">✓ Hired</p>
          )}
          {bid.status === 'rejected' && (
            <p className="text-gray-500 text-sm">Rejected</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BidList;
