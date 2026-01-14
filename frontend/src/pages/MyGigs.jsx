import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchGigs } from '../store/slices/gigSlice';
import api from '../services/api';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gigs, loading } = useSelector((state) => state.gigs);
  const [myGigs, setMyGigs] = useState([]);

  useEffect(() => {
    // Fetch all gigs and filter by current user
    dispatch(fetchGigs('')).then(() => {
      // Filter will be done after fetch
    });
  }, [dispatch]);

  useEffect(() => {
    if (gigs && user) {
      const filtered = gigs.filter(gig => gig.ownerId?._id === user.id);
      setMyGigs(filtered);
    }
  }, [gigs, user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
        <Link
          to="/create-gig"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
        >
          Post New Gig
        </Link>
      </div>

      {myGigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">You haven't posted any gigs yet.</p>
          <Link
            to="/create-gig"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create your first gig →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {gig.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {gig.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  ${gig.budget}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  gig.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {gig.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
