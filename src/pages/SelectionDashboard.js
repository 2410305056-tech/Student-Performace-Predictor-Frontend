/* eslint-disable no-unused-vars */

import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionDashboard = () => {
  const navigate = useNavigate();

  const [students] = useState([]); // no unused setter
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorNote, setMentorNote] = useState('');

  // ✅ Risk calculation (stable)
  const getRiskFromCn = useCallback((cn) => {
    const midsem = cn?.midsem ?? 0;
    const assignments = cn?.assignments ?? [];

    let total = 0;
    let count = 0;

    for (let i = 0; i < assignments.length; i++) {
      const marks = assignments[i]?.marks;
      if (marks !== 'Not Attempted') {
        total += Number(marks) || 0;
        count++;
      }
    }

    const avg = count > 0 ? total / count : 0;

    if (midsem < 20) return 'High';
    if (avg < 14) return 'Medium';
    return 'Low';
  }, []);

  // ✅ Memoized risk level
  const getRiskLevel = useCallback(
    (student) => {
      const cn = student?.performance?.computerNetworks;
      if (!cn) return 'Unknown';
      return getRiskFromCn(cn);
    },
    [getRiskFromCn]
  );

  // ✅ Filter students safely
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];

    if (!searchQuery) return students;

    const query = searchQuery.toLowerCase();

    return students.filter((s) =>
      s?.name?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  return (
    <div className="container">
      <h2>Selection Dashboard</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search student..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 📊 Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No students found
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => {
              const risk = getRiskLevel(student);

              return (
                <tr
                  key={student?._id || student?.rollNo}
                  className={
                    risk === 'High' ? 'table-row-high-risk' : ''
                  }
                >
                  <td>{student?.name || '-'}</td>
                  <td>{student?.rollNo || '-'}</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/student/${student?.rollNo}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ⚡ Actions */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => window.print()}>Print</button>
        <button onClick={() => setSearchQuery('')}>Clear</button>
      </div>

      {/* 📝 Notes */}
      <div style={{ marginTop: 20 }}>
        <h3>Mentor Notes</h3>
        <textarea
          value={mentorNote}
          onChange={(e) => setMentorNote(e.target.value)}
          placeholder="Write notes..."
        />
      </div>
    </div>
  );
};

export default SelectionDashboard;
