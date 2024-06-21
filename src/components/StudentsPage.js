import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Buffer } from 'buffer';

function StudentsPage() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/students/class/${classId}`);
        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [classId]);

  const handleAddStudent = async () => {
    try {
      if (!selectedFile) {
        console.error('No file selected');
        return;
      }

      const imageNameWithoutExtension = selectedFile.name.split('.').slice(0, -1).join('.');
      if (imageNameWithoutExtension !== studentName) {
        alert('The name of the student and the image file must be the same.');
        return;
      }
  
      const formData = new FormData();
      formData.append('name', studentName);
      formData.append('classId', classId);
      formData.append('image', selectedFile);
  
      const response = await axios.post('http://localhost:5001/api/students/addStudent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.success) {
        setStudents([...students, response.data.data]);
        setStudentName('');
        setSelectedFile(null);
        alert("Student added successfully");
      } else {
        console.error('Failed to add student');
        alert("Failed to add student");
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <h2>Students</h2>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Enter student name"
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAddStudent}>Add Student</button>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <div>
              {student.image && student.image.contentType && student.image.data ? (
                <img
                  src={`data:${student.image.contentType};base64,${Buffer.from(student.image.data).toString('base64')}`}
                  alt={student.name}
                  style={{ width: '100px', height: '100px' }}
                />
              ) : (
                <p>No image available</p>
              )}
              <span>{student.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsPage;
