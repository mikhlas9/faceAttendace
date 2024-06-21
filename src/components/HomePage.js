import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Make API call to fetch classes from backend
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/classes/getAllClasses'); // Adjust the URL as needed
        const data = await response.json();
        if (data.success) {
          setClasses(data.data);
        } else {
          console.error('Failed to fetch classes');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h1>Classes</h1>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem._id}>
            <Link to={`/class/${classItem._id}`}>{classItem.className}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
