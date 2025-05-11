import React, { useState } from 'react';
import { AnimalList } from './AnimalList';
import { HabitatList } from './HabitatList';
import ZookeeperList from './ZookeeperList';
import TaskList from './TaskList';
import EventList from './EventList';
import FeedbackList from './FeedbackList';
import TourList from './TourList';

import AddAnimalForm from './AddAnimalForm';
import AddHabitatForm from './AddHabitatForm';
import AddZookeeperForm from './AddZookeeperForm';
import AddTaskForm from './AddTaskForm';
import AddEventForm from './AddEventForm';
import AddTour from './AddTour';

import UpdateAnimalForm from './UpdateAnimalForm';
import UpdateHabitatForm from './UpdateHabitatForm';
import UpdateZookeeperForm from './UpdateZookeeperForm';
import UpdateTaskForm from './UpdateTaskForm';
import UpdateEventForm from './UpdateEventForm';
import UpdateTourForm from './UpdateTourForm';

import { DeleteAnimalForm } from './DeleteAnimalForm';
import { DeleteHabitatForm } from './DeleteHabitatForm';
import { DeleteZookeeperForm } from './DeleteZookeeperForm';
import DeleteTaskForm from './DeleteTaskForm';
import DeleteEventForm from './DeleteEventForm';
import DeleteTourForm from './DeleteTourForm';

function ZooManager() {
  const [activeTab, setActiveTab] = useState('viewAnimals');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="zoo-manager">
      <h1>Zoo Management System</h1>

      <div className="tabs">
        <div className="tab-group">
          <h3>View Data</h3>
          <button 
            className={activeTab === 'viewAnimals' ? 'active' : ''} 
            onClick={() => setActiveTab('viewAnimals')}
          >
            View Animals
          </button>
          <button 
            className={activeTab === 'viewHabitats' ? 'active' : ''} 
            onClick={() => setActiveTab('viewHabitats')}
          >
            View Habitats
          </button>
          <button 
            className={activeTab === 'viewZookeepers' ? 'active' : ''} 
            onClick={() => setActiveTab('viewZookeepers')}
          >
            View Zookeepers
          </button>
          <button 
            className={activeTab === 'viewTasks' ? 'active' : ''} 
            onClick={() => setActiveTab('viewTasks')}
          >
            View Tasks
          </button>
          <button 
            className={activeTab === 'viewEvents' ? 'active' : ''} 
            onClick={() => setActiveTab('viewEvents')}
          >
            View Events
          </button>
          <button 
            className={activeTab === 'viewTours' ? 'active' : ''} 
            onClick={() => setActiveTab('viewTours')}
          >
            View Tours
          </button>
          <button 
            className={activeTab === 'viewFeedback' ? 'active' : ''} 
            onClick={() => setActiveTab('viewFeedback')}
          >
            View Feedback
          </button>
        </div>

        <div className="tab-group">
          <h3>Add Data</h3>
          <button 
            className={activeTab === 'addAnimal' ? 'active' : ''} 
            onClick={() => setActiveTab('addAnimal')}
          >
            Add Animal
          </button>
          <button 
            className={activeTab === 'addHabitat' ? 'active' : ''} 
            onClick={() => setActiveTab('addHabitat')}
          >
            Add Habitat
          </button>
          <button 
            className={activeTab === 'addZookeeper' ? 'active' : ''} 
            onClick={() => setActiveTab('addZookeeper')}
          >
            Add Zookeeper
          </button>
          <button 
            className={activeTab === 'addTask' ? 'active' : ''} 
            onClick={() => setActiveTab('addTask')}
          >
            Add Task
          </button>
          <button 
            className={activeTab === 'addEvent' ? 'active' : ''} 
            onClick={() => setActiveTab('addEvent')}
          >
            Add Event
          </button>
          <button 
            className={activeTab === 'addTour' ? 'active' : ''} 
            onClick={() => setActiveTab('addTour')}
          >
            Add Tour
          </button>
        </div>

        <div className="tab-group">
          <h3>Update Data</h3>
          <button 
            className={activeTab === 'updateAnimal' ? 'active' : ''} 
            onClick={() => setActiveTab('updateAnimal')}
          >
            Update Animal
          </button>
          <button 
            className={activeTab === 'updateHabitat' ? 'active' : ''} 
            onClick={() => setActiveTab('updateHabitat')}
          >
            Update Habitat
          </button>
          <button 
            className={activeTab === 'updateZookeeper' ? 'active' : ''} 
            onClick={() => setActiveTab('updateZookeeper')}
          >
            Update Zookeeper
          </button>
          <button 
            className={activeTab === 'updateTask' ? 'active' : ''} 
            onClick={() => setActiveTab('updateTask')}
          >
            Update Task
          </button>
          <button 
            className={activeTab === 'updateEvent' ? 'active' : ''} 
            onClick={() => setActiveTab('updateEvent')}
          >
            Update Event
          </button>
          <button 
            className={activeTab === 'updateTour' ? 'active' : ''} 
            onClick={() => setActiveTab('updateTour')}
          >
            Update Tour
          </button>
        </div>

        <div className="tab-group">
          <h3>Delete Data</h3>
          <button 
            className={activeTab === 'deleteAnimal' ? 'active' : ''} 
            onClick={() => setActiveTab('deleteAnimal')}
          >
            Delete Animal
          </button>
          <button 
            className={activeTab === 'deleteHabitat' ? 'active' : ''} 
            onClick={() => setActiveTab('deleteHabitat')}
          >
            Delete Habitat
          </button>
          <button 
            className={activeTab === 'deleteZookeeper' ? 'active' : ''} 
            onClick={() => setActiveTab('deleteZookeeper')}
          >
            Delete Zookeeper
          </button>
          <button 
            className={activeTab === 'deleteTask' ? 'active' : ''} 
            onClick={() => setActiveTab('deleteTask')}
          >
            Delete Task
          </button>
          <button 
            className={activeTab === 'deleteEvent' ? 'active' : ''} 
            onClick={() => setActiveTab('deleteEvent')}
          >
            Delete Event
          </button>
          <button 
            className={activeTab === 'deleteTour' ? 'active' : ''} 
            onClick={() => setActiveTab('deleteTour')}
          >
            Delete Tour
          </button>
        </div>
      </div>

      <div className="tab-content">
        {/* View Components */}
        {activeTab === 'viewAnimals' && <AnimalList key={`animals-${refreshKey}`} />}
        {activeTab === 'viewHabitats' && <HabitatList key={`habitats-${refreshKey}`} />}
        {activeTab === 'viewZookeepers' && <ZookeeperList key={`zookeepers-${refreshKey}`} />}
        {activeTab === 'viewTasks' && <TaskList key={`tasks-${refreshKey}`} />}
        {activeTab === 'viewEvents' && <EventList key={`events-${refreshKey}`} />}
        {activeTab === 'viewTours' && <TourList key={`tours-${refreshKey}`} />}
        {activeTab === 'viewFeedback' && <FeedbackList key={`feedback-${refreshKey}`} />}

        {/* Add Components */}
        {activeTab === 'addAnimal' && (
          <AddAnimalForm onAnimalAdded={() => {
            refreshData();
            alert("Animal added successfully! View the updated list in the View Animals tab.");
          }} />
        )}
        {activeTab === 'addHabitat' && (
          <AddHabitatForm onHabitatAdded={() => {
            refreshData();
            alert("Habitat added successfully! View the updated list in the View Habitats tab.");
          }} />
        )}
        {activeTab === 'addZookeeper' && (
          <AddZookeeperForm onZookeeperAdded={() => {
            refreshData();
            alert("Zookeeper added successfully! View the updated list in the View Zookeepers tab.");
          }} />
        )}
        {activeTab === 'addTask' && (
          <AddTaskForm onTaskAdded={() => {
            refreshData();
            alert("Task added successfully! View the updated list in the View Tasks tab.");
          }} />
        )}
        {activeTab === 'addEvent' && (
          <AddEventForm onEventAdded={() => {
            refreshData();
            alert("Event added successfully! View the updated list in the View Events tab.");
          }} />
        )}
        {activeTab === 'addTour' && (
          <AddTour onTourAdded={() => {
            refreshData();
            alert("Tour added successfully! View the updated list in the View Tours tab.");
          }} />
        )}

        {/* Update Components */}
        {activeTab === 'updateAnimal' && <UpdateAnimalForm onAnimalUpdated={refreshData} />}
        {activeTab === 'updateHabitat' && <UpdateHabitatForm onHabitatUpdated={refreshData} />}
        {activeTab === 'updateZookeeper' && <UpdateZookeeperForm onZookeeperUpdated={refreshData} />}
        {activeTab === 'updateTask' && <UpdateTaskForm onTaskUpdated={refreshData} />}
        {activeTab === 'updateEvent' && <UpdateEventForm onEventUpdated={refreshData} />}
        {activeTab === 'updateTour' && <UpdateTourForm onTourUpdated={refreshData} />}

        {/* Delete Components */}
        {activeTab === 'deleteAnimal' && <DeleteAnimalForm onAnimalDeleted={refreshData} />}
        {activeTab === 'deleteHabitat' && <DeleteHabitatForm onHabitatDeleted={refreshData} />}
        {activeTab === 'deleteZookeeper' && <DeleteZookeeperForm onZookeeperDeleted={refreshData} />}
        {activeTab === 'deleteTask' && <DeleteTaskForm onTaskDeleted={refreshData} />}
        {activeTab === 'deleteEvent' && <DeleteEventForm onEventDeleted={refreshData} />}
        {activeTab === 'deleteTour' && <DeleteTourForm onTourDeleted={refreshData} />}
      </div>
    </div>
  );
}

export default ZooManager;

