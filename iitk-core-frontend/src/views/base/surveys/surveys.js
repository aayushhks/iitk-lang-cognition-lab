import './surveys.css';
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
  CFormInput,
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Tables = () => {
  const email = 'admin@admin.com';
  const columnNames = ["id", "Survey", "Date", "User Registered", "Scale", "Block 1 Repeats After (Blocks)", "Action"];

  const [rows, setRows] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [surveysData, setSurveysData] = useState({});
  const [filter, setFilter] = useState(Array(columnNames.length).fill(""));
  const [filterDummy, setFilterDummy] = useState(false);

  const handleExportData = async (filter) => {
    const exportDataPath = await get_surveys_data(filter, true);
    return exportDataPath;
  }

  const get_surveys_data = async (filter, export_) => {
    try {
      const response = await fetch(`${ip[0]}/get-surveys-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "filter": filter,
          "header": columnNames,
          "email": email,
          "export": export_,
        }),
        responseType: (export_ ? 'blob' : 'json') // Set responseType conditionally
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (export_) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'exported_file.csv'; // Replace with your desired filename
        link.click();
        URL.revokeObjectURL(url);

      } else {

        const result = await response.json();
        if (result.success === true) {
          setSurveysData(result.data || {}); // Ensure it's an object
          return result.data;
        } else {
          console.log("Error: ", result.msg);
        }
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const handleFilterChange = (e, filterIndex) => {
    const text = e.target.value;

    setFilter((prevFilter) => {
      const newFilter = [...prevFilter];
      newFilter[filterIndex] = text;
      return newFilter;
    });
  };

  // Convert the data into an array of rows
  const getRows = async () => {
    return await Promise.all(Object.entries(surveysData).map(async (item, idx) => {
      try {
        const email = item[0];
        const details = item[1];

        return (
          <CTableRow>
            <CTableDataCell className="w-25">{details[0] + 1}</CTableDataCell>
            <CTableDataCell className="w-25">{details[1]}</CTableDataCell>
            <CTableDataCell className="w-25">{details[2]}</CTableDataCell>
            <CTableDataCell className="w-25">{details[3]}</CTableDataCell>
            <CTableDataCell className="w-25">{details[4]}</CTableDataCell>
            <CTableDataCell className="w-25">{details[5]}</CTableDataCell>

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
    get_surveys_data(filter, false);
  }, [filterDummy])

  useEffect(() => {
    // Call get_surveys_data initially
    get_surveys_data(Array(columnNames.length).fill(""), false);

    // Set up the interval to call get_surveys_data every 5000ms
    const intervalId = setInterval(() => {
      setFilterDummy((prevFilterDummy) => {
        return (!prevFilterDummy)
      });
    }, 5000);
    
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    // Log the updated surveysData whenever it changes
    const fetchRows = async () => {

      const updatedRows = await getRows();
      setRows(updatedRows);
      await getRows(); // Fetch and set rows after surveysData is available
    };

    fetchRows();
  }, [surveysData]); // Runs every time surveysData changes

  useEffect(() => {
    get_surveys_data(filter, false);
  }, [filter]); // Runs every time filter updates

  const handleEdit = async (email, export_) => {
    // Call the edit function from the API
    try {
      const response = await fetch(`${ip[0]}/edit-user-account`, {
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

  const handleDelete = async (email, export_) => {
    // Call the edit function from the API
    try {
      const response = await fetch(`${ip[0]}/delete-user-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "filter": filter,
          "header": columnNames,
          "email": email,
          "export": export_,
        }),
        responseType: (export_ ? 'blob' : 'json') // Set responseType conditionally
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
    if (Object.keys(surveysData).length === 0) {
      return (
        <>
          <CTableRow>
            <CTableHeaderCell>
              <p htmlFor="inputTagline">Filter</p>
            </CTableHeaderCell>
            <CTableHeaderCell onClick={(e) => handleExportData(filter)}>
              <p className="export-btn" htmlFor="inputTagline">
                Export &nbsp;
                <CIcon icon={cilCloudDownload} size="lg" />
              </p>
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            {
              columnNames.slice(0, -1).map((item, index) => (
                <CTableHeaderCell>
                  <CFormInput
                    id={`inputTagline${index}`}
                    placeholder={item}
                    onChange={(e) => handleFilterChange(e, index)}
                  />
                </CTableHeaderCell>
              ))
            }
          </CTableRow>

          <CTableRow>
            <CTableDataCell colSpan={columnNames.length} className="no-recs-cell-surveys">
              <div className="no-recs-surveys">
                <h5>No records found</h5>
              </div>
            </CTableDataCell>
          </CTableRow>
        </>
      );
    } else {
      return (
        <>
          <CTableRow>
            <CTableHeaderCell>
              <p htmlFor="inputTagline">Filter</p>
            </CTableHeaderCell>
            <CTableHeaderCell
              onClick={(e) => handleExportData(filter, columnNames)}
              colSpan={9}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <p
                className="export-btn"
                htmlFor="inputTagline"
                // style={{ width: "400px !important" }}
              >
                Export &nbsp;
                <CIcon icon={cilCloudDownload} size="lg" />
              </p>
            </CTableHeaderCell>
          </CTableRow>

          <CTableRow>
            {
              columnNames.slice(0, -1).map((item, index) => (
                <CTableHeaderCell>
                  <CFormInput
                    id={`inputTagline${index}`}
                    placeholder={item}
                    onChange={(e) => handleFilterChange(e, index)}
                  />
                </CTableHeaderCell>
              ))
            }
          </CTableRow>

          <CTableRow>
            {
              columnNames.map((item, index) => (
                <CTableHeaderCell scope="col" className="w-25">
                  {item}
                </CTableHeaderCell>
              ))
            }
          </CTableRow>
        </>
      );
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Surveys</strong>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" responsive>
              <CTableBody>
                {header()}
                {(Object.keys(surveysData).length !== 0) ? rows : null}
            </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tables;
