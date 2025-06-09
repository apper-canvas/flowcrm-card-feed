import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import activityService from '@/services/api/activityService';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import StatsSection from '@/components/organisms/StatsSection';
import QuickActionsSection from '@/components/organisms/QuickActionsSection';
import RecentContactsSection from '@/components/organisms/RecentContactsSection';
import GettingStartedSection from '@/components/organisms/GettingStartedSection';

function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    totalDealValue: 0,
    recentActivities: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [contacts, deals, activities] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll()
        ]);

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

    loadDashboardData();
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
    return <LoadingSkeleton />;
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

        <StatsSection statsData={stats} formatCurrency={formatCurrency} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <QuickActionsSection actions={quickActions} initialDelay={0.5} />
          <RecentContactsSection contacts={recentContacts} initialDelay={0.5} />
        </div>

        <GettingStartedSection initialDelay={0.8} />
      </motion.div>
    </div>
  );
}

export default HomePage;