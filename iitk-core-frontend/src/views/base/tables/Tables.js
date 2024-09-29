import './Tables.css'
import React, { useState, useEffect } from "react"
// import { downloadData } from '../utils.jsx';

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
  // CFormLabel,
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// import { DocsExample } from 'src/components';

const Tables = () => {
  // TODO: Make Dynamic
  const email = "admin@admin.com";

  const columnNames = ["Email", "Name", "D.O.B", "Mother Tongue", "Current Location", "Hail from", "Survey Registered", "Survey Completed", "Words Rated", "Action"];

  const [rows, setRows] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [filter, setFilter] = useState(Array(columnNames.length).fill(""));
  const [filterDummy, setFilterDummy] = useState(false);

  const handleExportData = async (filter) => {
    const exportDataPath = await get_cust_mgmt_data(filter, true);
    // const downloadStatus = await downloadData(exportDataPath);
    // console.log('downloadStatus:', downloadStatus);
    return exportDataPath;
  }

  const get_cust_mgmt_data = async (filter, export_) => {
    try {
      const response = await fetch(`${ip[0]}/get-cust-mgmt-data`, {
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
  
          if (result.data) {
            setUsersData(result.data || {}); // Ensure it's an object
            return result.data_path;
          }
        } else {
          console.log("Error: ", result.err);
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
  }

  // Convert the data into an array of rows
  const getRows = async () => {
    return await Promise.all(Object.entries(usersData).map(async (item, idx) => {
      try {
        const email = item[1][0]
        const details = item.slice(1)[0];

        return (
          <CTableRow>
            {details.map((item, index) => (
              <CTableHeaderCell key={index} scope="col" className="w-25">
                {item}
              </CTableHeaderCell>
            ))}

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
    get_cust_mgmt_data(filter, false);
  }, [filterDummy])

  useEffect(() => {
    get_cust_mgmt_data(filter, false);
  }, [filter]); // Runs every time filter updates

  useEffect(() => {
    // Call get_cust_mgmt_data initially
    get_cust_mgmt_data(Array(columnNames.length).fill(""), false);

    // Set up the interval to call get_cust_mgmt_data every 5000ms
    const intervalId = setInterval(() => {
      setFilterDummy((prevFilterDummy) => {
        return (!prevFilterDummy)
      });  
    }, 5000);  

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts  

  useEffect(() => {
    // Log the updated usersData whenever it changes
    const fetchRows = async () => {
      const updatedRows = await getRows();
      setRows(updatedRows);
      await getRows(); // Fetch and set rows after usersData is available
    };  

    fetchRows();
  }, [usersData]); // Runs every time usersData changes

  const handleEdit = async (email) => {
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

  const handleDelete = async (email) => {
    // Call the edit function from the API
    try {
      const response = await fetch(`${ip[0]}/delete-user-account`, {
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
    if (Object.keys(usersData).length === 0) {
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
                <CTableHeaderCell key={index}>
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
            <CTableDataCell colSpan={columnNames.length} className="no-recs-cell-tables">
              <div className="no-recs-tables">
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
                <CTableHeaderCell key={index}>
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
                <CTableHeaderCell key={index} scope="col" className="w-25">
                  {item}
                </CTableHeaderCell>
                ))
            }
          </CTableRow>
          {/* </CTableHead> */}
        </>
      );
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            {/* <strong>React Table</strong> <small>Basic example</small> */}
            <strong>Table</strong>
          </CCardHeader>

          <CCardBody>
            <CTable align="middle" responsive>
            <CTableBody>
              {header()}
              {(Object.keys(usersData).length !== 0) ? rows : null}
              {/* {rows.length ? rows : <CTableRow><CTableDataCell colSpan="10" className="text-center">No records found</CTableDataCell></CTableRow>} */}
              {/* <CTableRow>
                {
                  usersData.map((item, index) => (
                    <CTableData key={index}>
                      <CTableCell>{item.email}</CTableCell>
                    </CTableData>
                  ))
                }
                <CTableDataCell>
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
          {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tables
