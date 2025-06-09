import { toast } from 'react-toastify';

class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal';
    this.fields = ['Name', 'title', 'value', 'stage', 'contact_id', 'probability', 'expected_close_date', 'created_at', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'];
    this.updateableFields = ['title', 'value', 'stage', 'contact_id', 'probability', 'expected_close_date', 'created_at'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.fields,
        orderBy: [
          {
            fieldName: "CreatedOn",
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
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
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
      console.error(`Error fetching deal with ID ${id}:`, error);
      toast.error('Failed to load deal');
      throw error;
    }
  }

  async create(dealData) {
    try {
      // Only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (dealData[field] !== undefined) {
          filteredData[field] = dealData[field];
        }
      });
// Ensure contact_id is an integer and handle contactId field mapping
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      } else if (dealData.contactId) {
        filteredData.contact_id = parseInt(dealData.contactId);
      }

      // Ensure value is a float
      if (filteredData.value !== undefined && filteredData.value !== '') {
        const parsedValue = parseFloat(filteredData.value);
        if (!isNaN(parsedValue)) {
          filteredData.value = parsedValue;
        }
      }

      // Ensure probability is a number
      if (filteredData.probability !== undefined) {
        const parsedProbability = parseInt(filteredData.probability);
        if (!isNaN(parsedProbability)) {
          filteredData.probability = parsedProbability;
        }
      }

      // Handle date format - ensure proper date format
      if (filteredData.expected_close_date) {
        filteredData.expected_close_date = filteredData.expected_close_date;
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
          toast.success('Deal created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create deal');
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      // Only include updateable fields
      const filteredData = { Id: id };
      this.updateableFields.forEach(field => {
        if (dealData[field] !== undefined) {
          filteredData[field] = dealData[field];
        }
      });
// Ensure contact_id is an integer and handle contactId field mapping
      if (filteredData.contact_id !== undefined) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      } else if (dealData.contactId !== undefined) {
        filteredData.contact_id = parseInt(dealData.contactId);
      }

      // Ensure value is a float
      if (filteredData.value !== undefined && filteredData.value !== '') {
        const parsedValue = parseFloat(filteredData.value);
        if (!isNaN(parsedValue)) {
          filteredData.value = parsedValue;
        }
      }

      // Ensure probability is a number
      if (filteredData.probability !== undefined) {
        const parsedProbability = parseInt(filteredData.probability);
        if (!isNaN(parsedProbability)) {
          filteredData.probability = parsedProbability;
        }
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
          toast.success('Deal updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update deal');
    } catch (error) {
      console.error('Error updating deal:', error);
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
          toast.success('Deal deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
      throw error;
    }
  }
}

export default new DealService();