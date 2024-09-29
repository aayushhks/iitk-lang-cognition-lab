// import './Tables.css';
import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

const Tables = () => {
  const [rows, setRows] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [completedCourses, setCompletedCourses] = useState({});

  const get_completed_course_count = async (email) => {
    // const email = localStorage.email;
    // console.log('kool:', email);
    try {
      const response = await fetch(`http://127.0.0.1:4997/get-completed-course-count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success === true) {
        // setCompletedCourses(result.completed_courses);
        // setSurveysCompleted(result.completed_courses.length);
        // console.log("Completed courses: ", result.completed_courses);
        setCompletedCourses(result.completed_courses);
        return result.completed_courses;
      } else {
        console.log("Error: ", result.err);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const get_users_data = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:4997/get-users-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success === true) {
        setUsersData(result.data || {}); // Ensure it's an object
      } else {
        console.log("Error: ", result.err);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  // Convert the data into an array of rows
  const getRows = async () => {
    
    return await Promise.all(Object.entries(usersData).map(async (item, idx) => {
      try {
        const email = item[0];
        const details = item[1];
        const completedCourses = await get_completed_course_count(email); // Await the result
        // console.log('cc:', completedCourses);

        const numberOfProjects = details.myProjects ? Object.keys(details.myProjects).length : 0;
        const wordsCompleted = details.myProjects ? Object.keys(details.myProjects).length : 0;
        // const surveyCompleted = completedCourses.length > 0;

        return (
          <CTableRow>
            {/* <CTableDataCell className="w-25">{email}</CTableDataCell> */}
            <CTableDataCell className="w-25">{details.name}</CTableDataCell>
            <CTableDataCell className="w-25">{details.dateOfBirth}</CTableDataCell>
            <CTableDataCell className="w-25">{details.ageAcquisitionMotherTongue}</CTableDataCell>
            <CTableDataCell className="w-25">{details.currentLocation}</CTableDataCell>
            <CTableDataCell className="w-25">{details.hailFrom}</CTableDataCell>
            <CTableDataCell className="w-25">{numberOfProjects}</CTableDataCell>
            {/* <CTableDataCell className="w-25">{(surveyCompleted) ? "Yes" : "No"}</CTableDataCell> */}
            <CTableDataCell className="w-25">{completedCourses.length}</CTableDataCell>
            <CTableDataCell className="w-25">{wordsCompleted}</CTableDataCell>
            <CTableDataCell className="w-25">
              <CButton className="action-btn" color="primary" onClick={() => handleEdit(email)}>Edit</CButton>
              <CButton className="action-btn" color="secondary" onClick={() => handleDelete(email)}>Delete</CButton>
            </CTableDataCell>
          </CTableRow>
        );
      } catch (e) {
        console.log("Error generating row:", e);
        return usersData;
      }
    }));
  };

  useEffect(() => {
    // Call get_users_data initially
    get_users_data();

    // Set up the interval to call get_users_data every 500ms
    const intervalId = setInterval(() => {
      get_users_data();
    }, 500);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    // Log the updated usersData whenever it changes
    const fetchRows = async () => {
      // await get_users_data(); // Fetch users data
      // const intervalId = setInterval(() => {
      //   await get_users_data();
      // }, 5000);

      const updatedRows = await getRows();
      setRows(updatedRows);
      await getRows(); // Fetch and set rows after usersData is available
    };

    fetchRows();
  }, [usersData]); // Runs every time usersData changes

  const handleEdit = async (email) => {
    // Call the edit function from the API
    try {
      const response = await fetch(`http://127.0.0.1:4997/edit-user-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // console.log(result);
      // if (result.success === true) {
      //   setUsersData(result.data);
      // } else {
      //   console.log("Error: ", result.err);
      // }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const handleDelete = async (email) => {
    // Call the edit function from the API
    try {
      const response = await fetch(`http://127.0.0.1:4997/delete-user-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success === true) {
        setUsersData(result.data);
      } else {
        console.log("Error: ", result.err);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const header = () => {
    // e.preventDefault();

    if (Object.keys(usersData).length === 0) {
      return (
        <div className="no-recs">
          <h5>No records found</h5>
        </div>
      );
    } else {
      return (
        <CTableRow>
            <CTableHeaderCell scope="col" className="w-25">
            Customer Name
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            SurveyId
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Survey Name
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Date Time
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Credits
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Word Attempted
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Status
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Block Size
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Block Completed
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className="w-25">
            Action
            </CTableHeaderCell>
        </CTableRow>
      );
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Table</strong> <small>Basic example</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p>
            <DocsExample href="components/table">
            <CTable align="middle" responsive>
            <CTableBody>
              {header()}
              {(Object.keys(usersData).length !== 0) ? rows : null}
           </CTableBody>
          </CTable>
          </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tables
