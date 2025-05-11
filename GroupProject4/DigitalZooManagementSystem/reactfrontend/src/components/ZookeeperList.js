import React, { useEffect, useState } from 'react';
import { getZookeepers } from '../services/api';
const ZookeeperList = () => {
  const [zookeepers, setZookeepers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZookeepers = async () => {
      try {
        const data = await getZookeepers();
        setZookeepers(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchZookeepers();
  }, []);

  if (error) {
    return <div>Failed to load zookeepers: {error.message}</div>;
  }

  return (
    <div>
      <h1>Zookeeper List</h1>
      <ul>
        {zookeepers.map((zookeeper) => (
          <li key={zookeeper.id}>{zookeeper.name} - {zookeeper.role} - {zookeeper.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ZookeeperList;