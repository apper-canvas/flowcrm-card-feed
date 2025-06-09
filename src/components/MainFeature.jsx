import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';
import activityService from '../services/api/activityService';

function MainFeature() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    totalDealValue: 0,
    recentActivities: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      // Calculate stats
      const activeDeals = deals.filter(deal => 
        deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
      );
      const totalDealValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
      const recentActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate >= weekAgo;
      });

      setStats({
        totalContacts: contacts.length,
        activeDeals: activeDeals.length,
        totalDealValue,
        recentActivities: recentActivities.length
      });

      // Get recent contacts (last 3)
      const sortedContacts = contacts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentContacts(sortedContacts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const quickActions = [
    {
      title: 'Add Contact',
      description: 'Create a new contact record',
      icon: 'UserPlus',
      color: 'bg-blue-500',
      action: () => navigate('/contacts')
    },
    {
      title: 'Create Deal',
      description: 'Start tracking a new opportunity',
      icon: 'TrendingUp',
      color: 'bg-green-500',
      action: () => navigate('/deals')
    },
    {
      title: 'Log Activity',
      description: 'Record customer interaction',
      icon: 'Calendar',
      color: 'bg-purple-500',
      action: () => navigate('/activities')
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-gray-600 text-sm font-medium">Pipeline Value</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats.totalDealValue)}
              </p>
            </div>
            <ApperIcon name="DollarSign" className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Recent Activities</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentActivities}</p>
            </div>
            <ApperIcon name="Activity" className="w-8 h-8 text-amber-500" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-surface transition-all duration-200"
              >
                <div className={`${action.color} p-3 rounded-lg`}>
                  <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400 ml-auto" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-gray-900">
              Recent Contacts
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contacts')}
              className="text-primary hover:text-secondary transition-colors text-sm font-medium"
            >
              View All
            </motion.button>
          </div>
          
          {recentContacts.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No contacts yet</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contacts')}
                className="gradient-button text-white px-4 py-2 rounded-lg text-sm"
              >
                Add Contact
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.email}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {contact.tags?.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {contact.tags[0]}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default MainFeature;