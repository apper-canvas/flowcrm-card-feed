import { toast } from 'react-toastify';

class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'Activity1';
    this.fields = ['Name', 'type', 'subject', 'notes', 'date', 'created_at', 'contact_id', 'deal_id', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'];
    this.updateableFields = ['type', 'subject', 'notes', 'date', 'created_at', 'contact_id', 'deal_id'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.fields,
        orderBy: [
          {
            fieldName: "date",
            SortType: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.fields
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error);
      toast.error('Failed to load activity');
      throw error;
    }
  }

  async create(activityData) {
    try {
      // Only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (activityData[field] !== undefined) {
          filteredData[field] = activityData[field];
        }
      });

      // Ensure contact_id is an integer
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      }

      // Ensure deal_id is an integer or null
      if (filteredData.deal_id) {
        filteredData.deal_id = parseInt(filteredData.deal_id);
      }

      // Handle date format - ensure ISO format for DateTime
      if (filteredData.date) {
        filteredData.date = new Date(filteredData.date).toISOString();
      }

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:`, failedRecords);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Activity created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create activity');
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      // Only include updateable fields
      const filteredData = { Id: id };
      this.updateableFields.forEach(field => {
        if (activityData[field] !== undefined) {
          filteredData[field] = activityData[field];
        }
      });

      // Ensure contact_id is an integer
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      }

      // Ensure deal_id is an integer or null
      if (filteredData.deal_id) {
        filteredData.deal_id = parseInt(filteredData.deal_id);
      }

      // Handle date format
      if (filteredData.date) {
        filteredData.date = new Date(filteredData.date).toISOString();
      }

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:`, failedUpdates);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Activity updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update activity');
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:`, failedDeletions);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Activity deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
      throw error;
    }
  }
}

export default new ActivityService();