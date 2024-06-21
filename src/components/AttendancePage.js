// components/AttendancePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AttendancePage() {
  const { classId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5001/api/attendance/class/${classId}`, {
        params: { month: selectedMonth, year: selectedYear }
      });

      if (response.data.success) {
        setAttendanceData(response.data.data);
      } else {
        console.error('Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const renderAttendanceTable = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));

    return (
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            {daysArray.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const studentAttendance = attendanceData.filter(record => record.studentId === student._id);
            return (
              <tr key={student._id}>
                <td>{student.name}</td>
                {daysArray.map(day => {
                  const dateStr = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${day}`;
                  const attendanceRecord = studentAttendance.find(record => record.date === dateStr);

                  // Check if the day is in the past (up to today's date)
                  const currentDate = new Date();
                  const checkDate = new Date(`${selectedYear}-${selectedMonth}-${day}`);
                  const isPastDate = checkDate <= currentDate;

                  if (isPastDate) {
                    return (
                      <td key={day} style={{ color: attendanceRecord ? 'green' : 'red' }}>
                        {attendanceRecord ? 'Present' : 'Absent'}
                      </td>
                    );
                  } else {
                    return <td key={day}></td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Attendance</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Month:
          <input type="text" value={selectedMonth} onChange={handleMonthChange} />
        </label>
        <label>
          Year:
          <input type="text" value={selectedYear} onChange={handleYearChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {renderAttendanceTable()}
    </div>
  );
}

export default AttendancePage;
