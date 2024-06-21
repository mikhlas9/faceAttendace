import React, { useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function ClassPage() {
  const { classId } = useParams();
  

  return (
    <div>
      <h2>Class {classId}</h2>
      <ul>
        <li><Link to={`/class/${classId}/students`}>Students</Link></li>
        <li><Link to={`/class/${classId}/attendance`}>Attendance</Link></li>
        <li><Link to={`/class/${classId}/scan`}>Scan</Link></li>
      </ul>
     
    </div>
  );
}

export default ClassPage;
