import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig } from '../store/slices/gigSlice';
import { submitBid, fetchBidsForGig, hireFreelancer } from '../store/slices/bidSlice';
import BidForm from '../components/BidForm';
import BidList from '../components/BidList';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, loading: bidsLoading } = useSelector((state) => state.bids);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showBids, setShowBids] = useState(false);

  useEffect(() => {
    dispatch(fetchGig(id));
  }, [dispatch, id]);

  const isOwner = currentGig && user && currentGig.ownerId?._id === user.id;

  const handleBidSubmit = async (bidData) => {
    const result = await dispatch(submitBid({ ...bidData, gigId: id }));
    if (!result.error) {
      setShowBidForm(false);
      if (isOwner) {
        dispatch(fetchBidsForGig(id));
      }
    }
  };

  const handleViewBids = () => {
    if (!showBids) {
      dispatch(fetchBidsForGig(id));
    }
    setShowBids(!showBids);
  };

  const handleHire = async (bidId) => {
    const result = await dispatch(hireFreelancer(bidId));
    if (!result.error) {
      dispatch(fetchBidsForGig(id));
      dispatch(fetchGig(id));
    }
  };

  if (gigLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Gig not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-indigo-600 hover:text-indigo-700 mb-4"
      >
        ← Back to Gigs
      </button>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            currentGig.status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {currentGig.status}
          </span>
        </div>

        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{currentGig.description}</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Posted by</p>
            <p className="font-medium">{currentGig.ownerId?.name || 'Unknown'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Budget</p>
            <p className="text-3xl font-bold text-indigo-600">${currentGig.budget}</p>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="bg-white shadow-md rounded-lg p-6">
          {isOwner ? (
            <div>
              <button
                onClick={handleViewBids}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium mb-4"
              >
                {showBids ? 'Hide' : 'View'} Bids ({bids.length})
              </button>
              {showBids && (
                <BidList
                  bids={bids}
                  loading={bidsLoading}
                  onHire={handleHire}
                  gigStatus={currentGig.status}
                />
              )}
            </div>
          ) : currentGig.status === 'open' ? (
            <div>
              {!showBidForm ? (
                <button
                  onClick={() => setShowBidForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
                >
                  Submit a Bid
                </button>
              ) : (
                <BidForm
                  onSubmit={handleBidSubmit}
                  onCancel={() => setShowBidForm(false)}
                />
              )}
            </div>
          ) : (
            <p className="text-gray-600">This gig has been assigned.</p>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-gray-700">
            Please{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              login
            </a>{' '}
            to submit a bid
          </p>
        </div>
      )}
    </div>
  );
};

export default GigDetails;
