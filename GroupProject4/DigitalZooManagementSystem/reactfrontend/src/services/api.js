import axios from 'axios';

const API_URL = 'http://localhost:8000/';

export const getHabitats = async () => {
  try {
    const response = await axios.get(`${API_URL}habitats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching habitats:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addHabitat = async (habitatData) => {
  try {
    const params = new URLSearchParams();
    params.append('name', habitatData.name);
    params.append('size', habitatData.size);
    params.append('climate', habitatData.climate);
    
    const response = await axios.get(`${API_URL}habitats/add/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error adding habitat:', error);
    throw error.response ? error.response.data : error;
  }
};

export const updateHabitat = async (habitatData) => {
  try {
    const params = new URLSearchParams();
    params.append('name', habitatData.name);
    
    if (habitatData.new_name) {
      params.append('new_name', habitatData.new_name);
    }
    if (habitatData.size) {
      params.append('size', habitatData.size);
    }
    if (habitatData.climate) {
      params.append('climate', habitatData.climate);
    }
    
    const response = await axios.get(`${API_URL}habitats/update/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error updating habitat:', error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteHabitat = async (name) => {
  try {
    const params = new URLSearchParams();
    params.append('name', name);
    
    const response = await axios.get(`${API_URL}habitats/delete/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting habitat:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getHabitatDetail = async (name) => {
  try {
    const response = await axios.get(`${API_URL}habitats/${name}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching habitat details:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getAnimals = async () => {
  try {
    const response = await axios.get(`${API_URL}animals/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching animals:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addAnimal = async (animalData) => {
  try {
    const params = new URLSearchParams();
    params.append('species', animalData.species);
    params.append('diet', animalData.diet);
    params.append('lifespan', animalData.lifespan);
    params.append('behaviour', animalData.behaviour);
    
    if (animalData.habitats && animalData.habitats.length > 0) {
      params.append('habitats', animalData.habitats.join(','));
    }
    
    const response = await axios.get(`${API_URL}animals/add/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error adding animal:', error);
    throw error.response ? error.response.data : error;
  }
};

export const updateAnimal = async (animalData) => {
  try {
    const params = new URLSearchParams();
    params.append('species', animalData.species);
    
    if (animalData.new_species) {
      params.append('new_species', animalData.new_species);
    }
    if (animalData.diet) {
      params.append('diet', animalData.diet);
    }
    if (animalData.lifespan) {
      params.append('lifespan', animalData.lifespan);
    }
    if (animalData.behaviour) {
      params.append('behaviour', animalData.behaviour);
    }
    if (animalData.habitats && animalData.habitats.length > 0) {
      params.append('habitats', animalData.habitats.join(','));
    }
    
    const response = await axios.get(`${API_URL}animals/update/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error updating animal:', error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteAnimal = async (species) => {
  try {
    const params = new URLSearchParams();
    params.append('species', species);
    
    const response = await axios.get(`${API_URL}animals/delete/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting animal:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getAnimalDetail = async (species) => {
  try {
    const response = await axios.get(`${API_URL}animals/${species}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching animal details:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getZookeepers = async () => {
  try {
    const response = await axios.get(`${API_URL}api/zookeepers/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching zookeepers:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addZookeeper = async (zookeeperData) => {
  try {
    const response = await axios.post(`${API_URL}api/zookeepers/`, zookeeperData);
    return response.data;
  } catch (error) {
    console.error('Error adding zookeeper:', error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteZookeeper = async (name) => {
  try {
    const params = new URLSearchParams();
    params.append('name', name);
    
    const response = await axios.get(`${API_URL}zookeepers/delete/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting zookeeper:', error);
    throw error.response ? error.response.data : error;
  }
};

export const updateZookeeper = async (zookeeperData) => {
  try {
    const params = new URLSearchParams();
    params.append('name', zookeeperData.name);
    
    if (zookeeperData.new_name) {
      params.append('new_name', zookeeperData.new_name);
    }
    if (zookeeperData.role) {
      params.append('role', zookeeperData.role);
    }
    if (zookeeperData.email) {
      params.append('email', zookeeperData.email);
    }
    
    const response = await axios.get(`${API_URL}zookeepers/update/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error updating zookeeper:', error);
    throw error.response ? error.response.data : error;
  }
};


export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}api/tasks/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}api/tasks/`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error.response ? error.response.data : error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}api/tasks/${taskId}/`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}api/tasks/${taskId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error.response ? error.response.data : error;
  }
};


export const getMemberships = async () => {
  try {
    const response = await axios.get(`${API_URL}api/membership/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}api/event/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addEvent = async (eventData) => {
  try {
    const params = new URLSearchParams();
    params.append('name', eventData.name);
    params.append('time', eventData.time);
    
    if (eventData.memberships && eventData.memberships.length > 0) {
      params.append('memberships', eventData.memberships.join(','));
    }
    
    const response = await axios.get(`${API_URL}events/add/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error.response ? error.response.data : error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${API_URL}api/event/${eventId}/`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}api/event/${eventId}/`);
    return { message: `Event with ID ${eventId} deleted successfully!` };;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addVisitor = async (visitorData) => {
  try {
    const response = await axios.post(`${API_URL}api/visitor/`, visitorData);
    return response.data;
  } catch (error) {
    console.error("Error adding visitor:", error);
    throw error.response ? error.response.data : error;
  }
};

export const loginVisitor = async (data) => {
  try {
    const response = await axios.post(`${API_URL}api/login/`, data);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};

export const eventLog = async (data) => {
  try {
    const response = await axios.post(`${API_URL}api/event/`, data);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'No log' };
  }
};

export const getVisitorAndEvents = async (name) => {
  try {
    const response = await axios.get(`${API_URL}api/visitor-events/`, {
      params: { name }
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to fetch events' };
  }
};

export const getTours = async () => {
  try {
    const response = await axios.get(`${API_URL}api/tour/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getTourById = async (tourId) => {
  try {
    const response = await axios.get(`${API_URL}api/tour/${tourId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour details:', error);
    throw error.response ? error.response.data : error;
  }
};

export const createTourWithRoute = async (tourData) => {
  try {
    const response = await axios.post(`${API_URL}create-tour-with-route/`, tourData);
    return response.data;
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error.response ? error.response.data : error;
  }
};

export const scheduleTour = async (tourId, startTime) => {
  try {
    const response = await axios.post(`${API_URL}schedule-tour/`, {
      tour_id: tourId,
      start_time: startTime
    });
    return response.data;
  } catch (error) {
    console.error('Error scheduling tour:', error);
    throw error.response ? error.response.data : error;
  }
};

export const updateTour = async (tourId, tourData) => {
  try {
    const response = await axios.put(`${API_URL}api/tour/${tourId}/`, tourData);
    return response.data;
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteTour = async (tourId) => {
  try {
    await axios.delete(`${API_URL}api/tour/${tourId}/`);
    return { message: `Tour with ID ${tourId} deleted successfully!` };
  } catch (error) {
    console.error('Error deleting tour:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getTourRoutes = async () => {
  try {
    const response = await axios.get(`${API_URL}api/tourroute/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour routes:', error);
    throw error.response ? error.response.data : error;
  }
};

export const addTourFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_URL}add-tour-feedback/`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting tour feedback:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getTourFeedback = async () => {
  try {
    const response = await axios.get(`${API_URL}api/tourfeedback/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour feedback:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getTourFeedbackByTour = async (tourId) => {
  try {
    const response = await axios.get(`${API_URL}api/tourfeedback/?tour=${tourId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tour feedback:', error);
    throw error.response ? error.response.data : error;
  }
};