import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import activityService from '../services/api/activityService';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterContact, setFilterContact] = useState('');
  const [formData, setFormData] = useState({
    type: 'call',
    contactId: '',
    dealId: '',
    subject: '',
    notes: '',
    date: ''
  });

  const activityTypes = [
    { id: 'call', label: 'Call', icon: 'Phone', color: 'bg-blue-500' },
    { id: 'email', label: 'Email', icon: 'Mail', color: 'bg-green-500' },
    { id: 'meeting', label: 'Meeting', icon: 'Calendar', color: 'bg-purple-500' },
    { id: 'note', label: 'Note', icon: 'FileText', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter activities
    let filtered = activities;

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    if (filterContact) {
      filtered = filtered.filter(activity => activity.contactId === filterContact);
    }

    setFilteredActivities(filtered);
  }, [activities, filterType, filterContact]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);

      // Sort activities by date (newest first)
      const sortedActivities = activitiesData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setActivities(sortedActivities);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (activity = null) => {
    if (activity) {
      setSelectedActivity(activity);
      setFormData({
        type: activity.type,
        contactId: activity.contactId,
        dealId: activity.dealId || '',
        subject: activity.subject,
        notes: activity.notes,
        date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : ''
      });
    } else {
      setSelectedActivity(null);
      const now = new Date();
      setFormData({
        type: 'call',
        contactId: '',
        dealId: '',
        subject: '',
        notes: '',
        date: now.toISOString().slice(0, 16)
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const handleSave = async () => {
    if (!formData.type || !formData.contactId || !formData.subject || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const activityData = {
        ...formData,
        dealId: formData.dealId || null,
        date: new Date(formData.date).toISOString()
      };

      if (selectedActivity) {
        const updatedActivity = await activityService.update(selectedActivity.id, activityData);
        setActivities(activities.map(a => a.id === selectedActivity.id ? updatedActivity : a));
        toast.success('Activity updated successfully');
      } else {
        const newActivity = await activityService.create(activityData);
        setActivities([newActivity, ...activities]);
        toast.success('Activity logged successfully');
      }
      closeModal();
    } catch (err) {
      toast.error('Failed to save activity');
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.delete(activityId);
      setActivities(activities.filter(a => a.id !== activityId));
      toast.success('Activity deleted successfully');
      closeModal();
    } catch (err) {
      toast.error('Failed to delete activity');
    }
  };

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

  const getContactDeals = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load activities</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4 sm:mb-0">
            Activities ({filteredActivities.length})
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="gradient-button text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Log Activity</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              {activityTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <select
              value={filterContact}
              onChange={(e) => setFilterContact(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">All Contacts</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities Timeline */}
        {filteredActivities.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterType !== 'all' || filterContact ? 'No matching activities' : 'No activities yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {filterType !== 'all' || filterContact ? 
                'Try adjusting your filters' : 
                'Start by logging your first customer interaction'
              }
            </p>
            {filterType === 'all' && !filterContact && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openModal()}
                className="gradient-button text-white px-4 py-2 rounded-lg"
              >
                Log Activity
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => {
              const typeInfo = getActivityTypeInfo(activity.type);
              const contactName = getContactName(activity.contactId);
              const dealTitle = getDealTitle(activity.dealId);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`${typeInfo.color} p-3 rounded-lg flex-shrink-0`}>
                        <ApperIcon name={typeInfo.icon} className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {activity.subject}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}/10 text-gray-800`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center space-x-2">
                            <ApperIcon name="User" className="w-4 h-4" />
                            <span>{contactName}</span>
                          </p>
                          
                          {dealTitle && (
                            <p className="flex items-center space-x-2">
                              <ApperIcon name="TrendingUp" className="w-4 h-4" />
                              <span>{dealTitle}</span>
                            </p>
                          )}
                          
                          <p className="flex items-center space-x-2">
                            <ApperIcon name="Clock" className="w-4 h-4" />
                            <span>{format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}</span>
                          </p>
                        </div>
                        
                        {activity.notes && (
                          <div className="mt-3 p-3 bg-surface rounded-lg">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {activity.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openModal(activity)}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(activity.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-heading font-semibold text-gray-900">
                      {selectedActivity ? 'Edit Activity' : 'Log Activity'}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    >
                      {activityTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact *
                    </label>
                    <select
                      value={formData.contactId}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          contactId: e.target.value,
                          dealId: '' // Reset deal when contact changes
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select a contact</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} - {contact.company || contact.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.contactId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Related Deal
                      </label>
                      <select
                        value={formData.dealId}
                        onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      >
                        <option value="">No related deal</option>
                        {getContactDeals(formData.contactId).map((deal) => (
                          <option key={deal.id} value={deal.id}>
                            {deal.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="e.g., Follow-up call about proposal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                      placeholder="Add any additional notes or details..."
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={!formData.type || !formData.contactId || !formData.subject || !formData.date}
                    className="gradient-button text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedActivity ? 'Save Changes' : 'Log Activity'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Activities;