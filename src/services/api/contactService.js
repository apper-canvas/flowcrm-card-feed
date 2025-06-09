import { toast } from 'react-toastify';

class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact';
    this.fields = ['Name', 'email', 'phone', 'company', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'created_at', 'updated_at'];
    this.updateableFields = ['Name', 'email', 'phone', 'company', 'Tags', 'created_at', 'updated_at'];
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
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
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
      console.error(`Error fetching contact with ID ${id}:`, error);
      toast.error('Failed to load contact');
      throw error;
    }
  }

async create(contactData) {
    try {
      // Only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (contactData[field] !== undefined) {
          filteredData[field] = contactData[field];
        }
      });
// Map form field 'name' to database field 'Name' if present
      if (contactData.name !== undefined && !filteredData.Name) {
        filteredData.Name = contactData.name;
      }

      // Handle Tags field - convert array to comma-separated string if needed
      if (filteredData.Tags) {
        if (Array.isArray(filteredData.Tags)) {
          filteredData.Tags = filteredData.Tags.join(',');
        }
      } else if (contactData.tags && Array.isArray(contactData.tags)) {
        filteredData.Tags = contactData.tags.join(',');
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
          toast.success('Contact created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create contact');
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

async update(id, contactData) {
    try {
      // Only include updateable fields
      const filteredData = { Id: id };
      this.updateableFields.forEach(field => {
        if (contactData[field] !== undefined) {
          filteredData[field] = contactData[field];
        }
      });
// Map form field 'name' to database field 'Name' if present
      if (contactData.name !== undefined && !filteredData.Name) {
        filteredData.Name = contactData.name;
      }

      // Handle Tags field - convert array to comma-separated string if needed
      if (filteredData.Tags) {
        if (Array.isArray(filteredData.Tags)) {
          filteredData.Tags = filteredData.Tags.join(',');
        }
      } else if (contactData.tags && Array.isArray(contactData.tags)) {
        filteredData.Tags = contactData.tags.join(',');
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
          toast.success('Contact updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update contact');
    } catch (error) {
      console.error('Error updating contact:', error);
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
          toast.success('Contact deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
      throw error;
    }
  }
}

export default new ContactService();