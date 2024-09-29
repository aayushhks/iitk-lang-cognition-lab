import './optedSurveys.css';
import React, { useState, useEffect, useRef } from "react";
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
  CFormInput
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

// import { DocsExample } from 'src/components'

const Tables = () => {
  // const columnNames = [
  //   "Email",
  //   "Name",
  //   "D.O.B",
  //   "Mother Tongue",
  //   "Current Location",
  //   "Hail from",
  //   "Survey Registered",
  //   "Survey Completed",
  //   "Words Rated",
  //   "Action"
  // ];

  // TODO: Make Dynamic
  const email = "admin@admin.com";

  const [rows, setRows] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [usersData, setUsersData] = useState({});
  // const [completedCourses, setCompletedCourses] = useState({});
  const [viewMode, setViewMode] = useState(0);
  const [courseNameWordsAttempted, setCourseNameWordsAttempted] = useState(0);
  const [userNameWordsAttempted, setUserNameWordsAttempted] = useState(0);
  const [wordsAttempted, setWordsAttempted] = useState([]);
  const [modeFilter, setModeFilter] = useState(Array(10).fill(""));
  const [modeFilterDummy, setModeFilterDummy] = useState(false);

  const rowDivRef = useRef(null);

  const handleExportData = async (filter) => {
    const exportDataPath = viewMode === 0 
    ? await get_users_data(filter, true)
    : await word_attempted(userNameWordsAttempted, courseNameWordsAttempted, true);
    return exportDataPath;
  }

  const handleFilterChange = (e, modeFilterIndex) => {
    const text = e.target.value;

    setModeFilter((prevModeFilter) => {
      const newModeFilter = [...prevModeFilter];
      newModeFilter[modeFilterIndex] = text;
      return newModeFilter;
    });
  }

  const word_attempted = async (userName, courseName, export_) => {

    if (!modeFilter) {return;}
    try {
      const response = await fetch(`${ip[0]}/word-attempted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          courseName,
          modeFilter,

          columnNames,
          email,
          export_,
        }), // JSON Structure
        responseType: (export_ ? 'blob' : 'json') // Set responseType conditionally
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (export_) {
        console.log('exportin\'');

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
          // console.log(result.data);
          setWordsAttempted(result.data || {}); // Ensure it's an object
          return result.data;
        } else {
          console.log("Error: ", result.err);
        }
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const get_users_data = async (filter, export_) => {
    try {
      const response = await fetch(`${ip[0]}/get-users-data`, {
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
          setUsersData(result.data || {}); // Ensure it's an object
        } else {
          console.log("Error: ", result.err);
        }
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const handleViewProgress = () => {
    console.log("Gentle Reminder");
  }

  const renderFields = () => {
    console.log('mother');

    let items = [""];
    if (viewMode === 0) {
      items = [
        "Customer Name",
        "Survey ID",
        "Survey Name",
        "Date",
        "Credits",
        "Words Attempted",
        "Status",
        "Block Size",
        "Block Completed",
        "Action",
      ];
    } else if (viewMode === 1) {
      items = [
        "Customer Name",
        "Survey ID",
        "Question",
        "Answer",
        "Created DTM",
        "Block No",
        "Question Type",
        "QID",
        "Repeat Counter",
        "Action",
      ]
    }

    // setColumnNames(items);

    return (
      [
        items,
        (
          <CTableRow>
            {
              items.map((item, index) => (
                <CTableHeaderCell key={index} scope="col" className="w-25">
                  {item}
                </CTableHeaderCell>
              ))
            }
          </CTableRow>
        )
      ]
    )
  };

  const handleViewModeToggle = async (userName, userCourse) => {
    setUserNameWordsAttempted(userName);
    setCourseNameWordsAttempted(userCourse);

    let wordsatt = await word_attempted(userName, userCourse, false);
    setViewMode(1 - viewMode);
    setWordsAttempted(wordsatt);

    return wordsatt;
  }

  // useEffect(() => {
  //   if (viewMode === 0) {
  //     get_users_data(modeFilter, false);
  //   } else {
  //     word_attempted(userNameWordsAttempted, courseNameWordsAttempted, false);
  //   }
  // }, [modeFilterDummy])

  useEffect(() => {
    if (viewMode === 0) {
      get_users_data(modeFilter, false);
    } else {
      word_attempted(userNameWordsAttempted, courseNameWordsAttempted, false);
    }
  }, [modeFilter]); // Runs every time modeFilter updates

  // Convert the data into an array of rows
  const getRows = async () => {
    if (viewMode === 0) {
      return await Promise.all(Object.entries(usersData).map(async (item, idx) => {
        try {
          const email = item[1][0];
          const details = item.slice(1)[0];

          return (
            <CTableRow>
              {
                details.map((item, index) => (
                  <CTableDataCell key={index} style={{ width: '300px' }} ref={rowDivRef} scope="col" className="w-50">
                    {/* <a href=""></a> */}
                    {index === 5 ? (
                      <>
                        <div className="view-opted-surveys-btn" onClick={(e) => handleViewModeToggle(details[0], details[2])}>
                          {item - 1 === 0 ? item - 1 : item - 2} [View]
                        </div>
                      </>
                    ) : (
                      item
                    )}
                  </CTableDataCell>
                ))
              }
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
    } else {
      if (!wordsAttempted) {
        return (
          <CTableRow>
            <CTableDataCell colSpan={10} className="no-recs-cell-opted-surveys">
              <div className="no-recs-opted-surveys">
                <h5>Loading Records</h5>
              </div>
            </CTableDataCell>
          </CTableRow>
        )
      }
      return await Promise.all(Object.entries(wordsAttempted).map(async (item, idx) => {
        try {
          const email = item[0];
          const details = item[1];

          return (
            <CTableRow>
              {
                details.map((item, index) => (
                  <CTableDataCell ref={rowDivRef} scope="col" className="w-25">
                    {item}
                  </CTableDataCell>
                ))
              }
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
    }
  };

  useEffect(() => {
    // Call get_users_data initially
    get_users_data(Array(9).fill(""), false);

    const intervalId = setInterval(() => {
      if (viewMode === 0) {
        setModeFilterDummy((prevFilterDummy) => {
          return (!prevFilterDummy)
        });
      }
    }, 5000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // // Additional useEffect to handle viewMode change to 1 without waiting for the interval
  // useEffect(() => {
  //   if (viewMode === 1) {
  //     // Perform the action immediately without waiting for the 5000ms interval
  //     setModeFilterDummy((prevFilterDummy) => {
  //       return (!prevFilterDummy);
  //     });
  //   }
  // }, [viewMode]); // This effect runs whenever viewMode changes

  useEffect(() => {
    // Log the updated usersData whenever it changes
    const fetchRows = async () => {
      const updatedRows = await getRows();
      setRows(updatedRows);
      await getRows(); // Fetch and set rows after usersData is available
    };

    fetchRows();
  }, [usersData, wordsAttempted]); // Runs every time usersData or wordsAttempted changes

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
    const fields = renderFields();
    // const fields = [['avada kedavra', 1, 2, 3, 4]];
    console.log('fields', fields, Object.keys(usersData).length);

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
            {fields[0].slice(0, -1).map((item, index) => (
              <CTableHeaderCell key={index}>
                <CFormInput
                  id={`inputTagline${index}`}
                  placeholder={item}
                  onChange={(e) => handleFilterChange(e, index)}
                />
              </CTableHeaderCell>
            ))}
          </CTableRow>
  
          <CTableRow>
            <CTableDataCell colSpan={fields[0].length} className="no-recs-cell-opted-surveys">
              <div className="no-recs-opted-surveys">
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
              onClick={(e) => handleExportData(modeFilter)}
              colSpan={9}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <p className="export-btn" htmlFor="inputTagline">
                Export &nbsp;
                <CIcon icon={cilCloudDownload} size="lg" />
              </p>
            </CTableHeaderCell>
          </CTableRow>
  
          <CTableRow>
            {fields[0].slice(0, -1).map((item, index) => (
              <CTableHeaderCell key={index}> {/* Add key prop */}
                <CFormInput
                  id={`inputTagline${index}`}
                  placeholder={item}
                  onChange={(e) => handleFilterChange(e, index)}
                />
              </CTableHeaderCell>
            ))}
          </CTableRow>
  
          {fields[1]}
        </>
      );
    }
  };
  
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Opted Surveys</strong>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" responsive>
              <CTableBody>
                {header()}
                {Object.keys(usersData).length !== 0 ? rows : null}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );  
}

export default Tables;
