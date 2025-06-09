import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ActivityTimeline = ({ 
  activities, 
  contacts, 
  deals, 
  onEditActivity, 
  onDeleteActivity,
  filterType,
  filterContact,
  dateRange 
}) => {
  const [expandedActivity, setExpandedActivity] = useState(null);

  const activityTypes = [
    { id: 'call', label: 'Call', icon: 'Phone', color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'email', label: 'Email', icon: 'Mail', color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'meeting', label: 'Meeting', icon: 'Calendar', color: 'bg-purple-500', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'note', label: 'Note', icon: 'FileText', color: 'bg-gray-500', textColor: 'text-gray-600', bgColor: 'bg-gray-50' }
  ];

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Filter by contact
    if (filterContact) {
      filtered = filtered.filter(activity => activity.contactId === filterContact);
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = startOfDay(new Date(dateRange.start));
      const endDate = endOfDay(new Date(dateRange.end));
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.date);
        return isWithinInterval(activityDate, { start: startDate, end: endDate });
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activities, filterType, filterContact, dateRange]);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.id === dealId);
    return deal?.title || 'Unknown Deal';
  };

  const getActivityTypeInfo = (type) => {
    return activityTypes.find(t => t.id === type) || activityTypes[0];
  };

  const toggleExpanded = (activityId) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  if (filteredActivities.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="Clock" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {filterType !== 'all' || filterContact || dateRange.start ? 'No matching activities' : 'No activities in timeline'}
        </h3>
        <p className="text-gray-500">
          {filterType !== 'all' || filterContact || dateRange.start ? 
            'Try adjusting your filters to see more activities' : 
            'Activities will appear here as they are logged'
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-4 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
      
      <div className="space-y-6">
        {filteredActivities.map((activity, index) => {
          const typeInfo = getActivityTypeInfo(activity.type);
          const contactName = getContactName(activity.contactId);
          const dealTitle = getDealTitle(activity.dealId);
          const isExpanded = expandedActivity === activity.id;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white shadow-sm hidden sm:block z-10"
                   style={{ backgroundColor: typeInfo.color.replace('bg-', '#') }} />
              
              {/* Activity card */}
              <div className="sm:ml-16 ml-0">
                <motion.div
                  className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${typeInfo.bgColor}/20`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Mobile icon (visible on small screens) */}
                        <div className={`${typeInfo.color} p-3 rounded-lg flex-shrink-0 sm:hidden`}>
                          <ApperIcon name={typeInfo.icon} className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {activity.subject}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                              <ApperIcon name={typeInfo.icon} className="w-3 h-3 mr-1" />
                              {typeInfo.label}
                            </span>
                          </div>

                          {/* Metadata */}
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-4 flex-wrap gap-2">
                              <span className="flex items-center space-x-1">
                                <ApperIcon name="User" className="w-4 h-4" />
                                <span className="font-medium">{contactName}</span>
                              </span>
                              
                              {dealTitle && (
                                <span className="flex items-center space-x-1">
                                  <ApperIcon name="TrendingUp" className="w-4 h-4" />
                                  <span>{dealTitle}</span>
                                </span>
                              )}
                              
                              <span className="flex items-center space-x-1">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                <span>{format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}</span>
                              </span>
                            </div>
                          </div>

                          {/* Notes preview */}
                          {activity.notes && (
                            <div className="mt-3">
                              <div className={`p-3 ${typeInfo.bgColor} rounded-lg transition-all duration-200`}>
                                <p className={`text-sm ${typeInfo.textColor} ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                  {activity.notes}
                                </p>
                                {activity.notes.length > 100 && (
                                  <button
                                    onClick={() => toggleExpanded(activity.id)}
                                    className={`mt-2 text-xs ${typeInfo.textColor} hover:underline focus:outline-none focus:underline`}
                                    aria-label={isExpanded ? 'Show less' : 'Show more'}
                                  >
                                    {isExpanded ? 'Show less' : 'Show more'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEditActivity(activity)}
                          className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-gray-100"
                          aria-label={`Edit activity: ${activity.subject}`}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteActivity(activity.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                          aria-label={`Delete activity: ${activity.subject}`}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll to top button for long timelines */}
      {filteredActivities.length > 10 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ApperIcon name="ArrowUp" className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default ActivityTimeline;