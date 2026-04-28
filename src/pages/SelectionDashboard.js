import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectionDashboard = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorNote, setMentorNote] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // ✅ Stable risk calculation (no re-creation on every render)
  const getRiskFromCn = useCallback((cn) => {
    const midsem = cn?.midsem || 0;
    const assignments = cn?.assignments || [];

    let total = 0;
    let count = 0;

    for (let i = 0; i < assignments.length; i++) {
      const marks = assignments[i].marks;
      if (marks !== 'Not Attempted') {
        total += Number(marks);
        count++;
      }
    }

    const avg = count ? total / count : 0;

    if (midsem < 20) return 'High';
    if (avg < 14) return 'Medium';
    return 'Low';
  }, []);

  // ✅ Memoized function
  const getRiskLevel = useCallback((student) => {
    const cn = student?.performance?.computerNetworks;
    if (!cn) return 'Unknown';
    return getRiskFromCn(cn);
  }, [getRiskFromCn]);

  // ✅ Optimized filtering (runs only when needed)
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;

    const query = searchQuery.toLowerCase();

    return students.filter((student) =>
      student.name?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // ✅ High risk students (fast + memoized)
  const highRiskStudents = useMemo(() => {
    return students.filter((s) => getRiskLevel(s) === 'High');
  }, [students, getRiskLevel]);

  // ✅ Grouping optimized
  const highRiskByCourseYear = useMemo(() => {
    const grouped = Object.create(null);

    for (let i = 0; i < highRiskStudents.length; i++) {
      const s = highRiskStudents[i];
      const key = `${s.course}__${s.year}`;

      if (!grouped[key]) {
        grouped[key] = {
          course: s.course,
          year: s.year,
          students: [],
        };
      }

      grouped[key].students.push(s);
    }

    return grouped;
  }, [highRiskStudents]);

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
          {filteredStudents.map((student) => {
            const risk = getRiskLevel(student);

            return (
              <tr
                key={student._id}
                className={risk === 'High' ? 'table-row-high-risk' : ''}
              >
                <td>{student.name}</td>
                <td>{student.rollNo}</td>
                <td>
                  <button
                    onClick={() => navigate(`/student/${student.rollNo}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ⚡ Actions */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => window.print()}>Print</button>
        <button onClick={() => setSearchQuery('')}>Clear</button>
        <button onClick={() => setShowFeedbackModal(true)}>
          Feedback
        </button>
      </div>

      {/* 📝 Notes */}
      <div style={{ marginTop: 20 }}>
        <h3>Mentor Notes</h3>
        <textarea
          value={mentorNote}
          onChange={(e) => setMentorNote(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SelectionDashboard;
