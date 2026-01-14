import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../services/socket';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user || !user.id) return;

    // Listen for notifications
    const notificationChannel = `notification:${user.id}`;
    socket.on(notificationChannel, (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off(notificationChannel);
    };
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
        
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications yet.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {notification.message}
                    </p>
                    {notification.gig && (
                      <p className="text-sm text-green-600 mt-1">
                        Project: {notification.gig.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
