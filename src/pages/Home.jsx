import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';
import activityService from '../services/api/activityService';

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    recentActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuickStats = async () => {
      try {
        const [contacts, deals, activities] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll()
        ]);

        setStats({
          totalContacts: contacts.length,
          activeDeals: deals.filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost').length,
          recentActivities: activities.filter(activity => {
            const activityDate = new Date(activity.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate >= weekAgo;
          }).length
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuickStats();
  }, []);

  const quickActions = [
    {
      title: 'Add Contact',
      description: 'Create a new contact record',
      icon: 'UserPlus',
      color: 'bg-blue-500',
      action: () => navigate('/contacts')
    },
    {
      title: 'Log Activity',
      description: 'Record a customer interaction',
      icon: 'Calendar',
      color: 'bg-green-500',
      action: () => navigate('/activities')
    },
    {
      title: 'Track Deal',
      description: 'Monitor sales progress',
      icon: 'TrendingUp',
      color: 'bg-purple-500',
      action: () => navigate('/deals')
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
          Welcome to FlowCRM
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="gradient-card text-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Contacts</p>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
              </div>
              <ApperIcon name="Users" className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Deals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeDeals}</p>
              </div>
              <ApperIcon name="TrendingUp" className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Recent Activities</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recentActivities}</p>
              </div>
              <ApperIcon name="Calendar" className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-left hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-surface border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
            Getting Started with FlowCRM
          </h3>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-center space-x-2">
              <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
              <span>Import or add your first contacts</span>
            </p>
            <p className="flex items-center space-x-2">
              <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
              <span>Create deals and track them through your pipeline</span>
            </p>
            <p className="flex items-center space-x-2">
              <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
              <span>Log activities to maintain detailed customer history</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;