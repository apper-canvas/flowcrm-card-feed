import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';
import activityService from '../services/api/activityService';

function Dashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    totalDealValue: 0,
    conversionRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [dealsPipeline, setDealsPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
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
        const closedWonDeals = deals.filter(deal => deal.stage === 'closed-won');
        const totalDeals = deals.length;
        const conversionRate = totalDeals > 0 ? (closedWonDeals.length / totalDeals) * 100 : 0;
        const totalDealValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);

        setStats({
          totalContacts: contacts.length,
          activeDeals: activeDeals.length,
          totalDealValue,
          conversionRate
        });

        // Get recent activities (last 5)
        const sortedActivities = activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        // Add contact names to activities
const activitiesWithContacts = sortedActivities.map(activity => {
          const contact = contacts.find(c => c.Id === activity.contact_id);
          return { ...activity, contactName: contact?.Name || 'Unknown Contact' };
        });
setRecentActivities(activitiesWithContacts);

        // Pipeline summary
        const pipelineStages = ['lead', 'qualified', 'proposal', 'negotiation'];
        const pipeline = pipelineStages.map(stage => {
          const stageDeals = activeDeals.filter(deal => deal.stage === stage);
          return {
            stage,
            count: stageDeals.length,
            value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
          };
        });

        setDealsPipeline(pipeline);
      } catch (err) {
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStageLabel = (stage) => {
    const labels = {
      lead: 'Lead',
      qualified: 'Qualified',
      proposal: 'Proposal',
      negotiation: 'Negotiation'
    };
    return labels[stage] || stage;
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Calendar',
      note: 'FileText'
    };
    return icons[type] || 'Activity';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load dashboard</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
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
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.conversionRate.toFixed(1)}%
                </p>
              </div>
              <ApperIcon name="Target" className="w-8 h-8 text-amber-500" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
              Pipeline Summary
            </h2>
            {dealsPipeline.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="TrendingUp" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active deals in pipeline</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dealsPipeline.map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium text-gray-900">
                        {getStageLabel(stage.stage)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {stage.count} deals
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(stage.value)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
              Recent Activities
            </h2>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 hover:bg-surface rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        className="w-4 h-4 text-primary" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.subject}
                      </p>
                      <p className="text-sm text-gray-600">
                        with {activity.contactName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;