// Original code

import './Admintable.css';
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

const AdMgmtTables = () => {
  const [rows, setRows] = useState([]);
  const [adMgmtData, setAdMgmtData] = useState({});
  // const [usersData, setUsersData] = useState({});

  const get_ad_mgmt_table = async () => {
    try {
      const endpoint = `http://127.0.0.1:4997/get-ad-mgmt-table`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      
      const result = await response.json();

      console.log('watashi', result.data);

      if (result.success === true) {
        // await get_completed_course_count();
        setAdMgmtData(result.data || {}); // Ensure it's an object
        // console.log("Fetched data: ", result.data);
      } else {
        console.log("Error: ", result.err);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  // Convert the data into an array of rows
  const getRows = async () => {

    return await Promise.all(Object.entries(adMgmtData).map(async (item, idx) => {
      try {
        const question = item[1][0];
        const wordType = item[1][1];
        const surveyId = item[1][2];

        console.log(surveyId);
        console.log(question);
        console.log(wordType);
        console.log("------")

        return (
          <CTableRow>
            <CTableDataCell className="w-25">{surveyId}</CTableDataCell>
            <CTableDataCell className="w-25">{question}</CTableDataCell>
            <CTableDataCell className="w-25">{wordType}</CTableDataCell>
            <CTableDataCell className="w-25">
              <CButton className="action-btn" color="primary" onClick={() => handleEdit(email)}>Edit</CButton>
              <CButton className="action-btn" color="secondary" onClick={() => handleDelete(email)}>Delete</CButton>
            </CTableDataCell>
          </CTableRow>
        );
      } catch (e) {
        console.log("Error generating row:", e);
        return adMgmtData;
      }
    }));
  };

  useEffect(() => {
    // Call get_users_data initially
    // get_ad_mgmt_table();

    // // Set up the interval to call get_users_data every 500ms
    // const intervalId = setInterval(() => {
    //   get_ad_mgmt_table();
    // }, 15000); // Every 15 seconds (data too big to fetch in time)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    // Log the updated adMgmtData whenever it changes
    const fetchRows = async () => {

      const updatedRows = await getRows();
      // setRows(updatedRows);
      // await getRows(); // Fetch and set rows after adMgmtData is available
    };

    fetchRows();
  }, [adMgmtData]); // Runs every time adMgmtData changes

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
        setAdMgmtData(result.data);
      } else {
        console.log("Error: ", result.err);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const header = () => {
    // e.preventDefault();

    if (Object.keys(adMgmtData).length === 0) {
      return (
        <div className="no-recs">
          <h5>No records found</h5>
        </div>
      );
    } else {
      return (
      // <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col" className="w-25">
          SurveyId
        </CTableHeaderCell>
        <CTableHeaderCell scope="col" className="w-25">
          Question
        </CTableHeaderCell>
        <CTableHeaderCell scope="col" className="w-25">
          WordType
        </CTableHeaderCell>
        <CTableHeaderCell scope="col" className="w-25">
          Action
        </CTableHeaderCell>
      </CTableRow>
      );
    }
  }

  return (
    // <p>Treat</p>
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
              {(Object.keys(adMgmtData).length !== 0) ? rows : null}
              {/* {rows.length ? rows : <CTableRow><CTableDataCell colSpan="10" className="text-center">No records found</CTableDataCell></CTableRow>} */}
              {/* <CTableRow>
                {
                  adMgmtData.map((item, index) => (
                    <CTableData key={index}>
                      <CTableCell>{item.email}</CTableCell>
                    </CTableData>
                  ))
                }
                <CTableDataCell>
                  MAKIchew
                </CTableDataCell>
              </CTableRow>
              <CTableRow align="bottom">
              </CTableRow>
              <CTableRow>
                <CTableDataCell>
                  This cell inherits <code>vertical-align: middle;</code> from the table
                </CTableDataCell>
                <CTableDataCell>
                  hehe lol <code>colorful</code> from the table
                </CTableDataCell>
                <CTableDataCell align="top">This cell is aligned to the top.</CTableDataCell>
              </CTableRow> */}
            </CTableBody>
          </CTable>
          </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdMgmtTables
