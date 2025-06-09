import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  }

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.activities.unshift(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(400);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData
    };
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await delay(300);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    this.activities.splice(index, 1);
    return true;
  }
}

export default new ActivityService();