// Original code

import './LangMgmt.css';
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
  CTableRow,
  // CForm,
  // CFormInput,
  // CFormSelect,
  // CTableHeaderCell,
  // CFormLabel
} from '@coreui/react'

const LangMgmt = () => {
  const endOffset = 1000;
  const [rows, setRows] = useState([]);
  const [adMgmtData, setAdMgmtData] = useState({});

  const [offsetStart, setOffsetStart] = useState(0);
  const [filterType, setFilterType] = useState(0);
  const [filterQuery, setFilterQuery] = useState(0);
  const [filterResultCount, setFilterResultCount] = useState('NA');

  const handleChangePage = async (val) => {
    if (val === 1) {
      if (offsetStart !== endOffset) {
        setOffsetStart(offsetStart + 12);
        return 0;
      } else {
        return 1;
      }
    }
    if (val === 0) {
      if (offsetStart !== 0) {
        setOffsetStart(offsetStart - 12);
        return 0;
      } else {
        return 1;
      }
    }
  }

  const get_ad_mgmt_table = async () => {
    try {
      const endpoint = `${ip[0]}/get-ad-mgmt-table`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([offsetStart, offsetStart + 12, filterType, filterQuery])
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.success === true) {
        setAdMgmtData(result.data || {}); // Ensure it's an object
        setFilterResultCount(result.result_count);
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
        const question = item[1]['question'];
        const wordType = item[1]['wordType'];
        const surveyId = item[1]['title'];

        return (
          <CTableRow>
            {/* col 1 */}
            <CTableDataCell className="w-25">{surveyId}</CTableDataCell>
            {/* col 1 */}
            <CTableDataCell className="w-25">{question}</CTableDataCell>
            {/* col 1 */}
            <CTableDataCell className="w-25">{wordType}</CTableDataCell>
            {/* action col 4 */}
            <CTableDataCell className="w-25">
              <CButton className="action-btn" color="primary" onClick={() => handleEdit(email)}>Edit</CButton>
              <CButton className="action-btn" color="secondary" onClick={() => handleDelete(email)}>Delete</CButton>
            </CTableDataCell>
          </CTableRow>
        );
      } catch (e) {
        console.log("Error generating row:", e);
        return (
          <></>
        );
      }
    }));
  };

  useEffect(() => {
    // Call get_users_data initially
    // console.log('fee');
    get_ad_mgmt_table();

    // // Set up the interval to call get_users_data every 500ms
    // const intervalId = setInterval(() => {
    //   get_ad_mgmt_table();
    // }, 5000); // Every 15 seconds (data too big to fetch in time)

    // Cleanup function to clear the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    get_ad_mgmt_table();
  }, [offsetStart])

  useEffect(() => {
    // Log the updated adMgmtData whenever it changes
    const fetchRows = async () => {
      const updatedRows = await getRows();
      // console.log('ur:', updatedRows);
      setRows(updatedRows);
    };

    fetchRows();
  }, [adMgmtData]); // Runs every time adMgmtData changes

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

    return (
      <CTableRow>
        <CTableDataCell colSpan={4} className="no-recs-cell-langmgmt">
          <div className="no-recs-langmgmt">
            <h5>Under Development</h5>
          </div>
        </CTableDataCell>
      </CTableRow>
    )

    // if (Object.keys(adMgmtData).length === 0) {
    //   return (
    //     <CTableRow>
    //       <CTableDataCell colSpan={4} className="no-recs-cell-langmgmt">
    //         <div className="no-recs-langmgmt">
    //           <h5>Under Development</h5>
    //         </div>
    //       </CTableDataCell>
    //     </CTableRow>
    //   );
    // } else {
    //   return (
    //   // <CTableHead>
    //   <CTableRow>
    //     <CTableHeaderCell scope="col" className="w-25">
    //       SurveyId
    //     </CTableHeaderCell>
    //     <CTableHeaderCell scope="col" className="w-25">
    //       Question
    //     </CTableHeaderCell>
    //     <CTableHeaderCell scope="col" className="w-25">
    //       WordType
    //     </CTableHeaderCell>
    //     <CTableHeaderCell scope="col" className="w-25">
    //       Action
    //     </CTableHeaderCell>
    //   </CTableRow>
    //   );
    // }
  }

  useEffect(() => {
    setOffsetStart(0);
    console.log('ggoo', filterQuery, filterType);
    get_ad_mgmt_table()
  }, [filterQuery, filterType])

  // useEffect(() => {
  //   const handleSearch = async () => {
  //     try {
  //       const response = await axios.post('/get-ad-mgmt-table', {
  //         offset_start: 0,  // Adjust offset as needed
  //         offset_end: 100,  // Adjust offset as needed
  //         filter_type: filterType,
  //         filter_query: searchQuery,
  //       });

  //       if (response.data.success) {
  //         setResults(response.data.data);
  //         // Handle the returned data
  //       } else {
  //         console.error('Error:', response.data.msg);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   // Call the search function when either searchQuery or filterType changes
  //   handleSearch();
  // }, [searchQuery, filterType]);

  return (
    // <p>Treat</p>
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            {/* TODO: Uncomment this for result count */}
            <strong>Language Management</strong>
          </CCardHeader>
          <CCardBody>
            {/* <div className="page-buttons">
              <CButton className='page-prev-btn page-change-btn' color="secondary" onClick={() => handleChangePage(0)}>Left</CButton>
              <CButton className='page-next-btn page-change-btn' color="primary" onClick={() => handleChangePage(1)}>Right</CButton>
              <CForm>
                <CFormInput
                  type="text"
                  placeholder="Search"
                  aria-label="default input example"
                  onChange={(e) => setFilterQuery(e.target.value)}
                  />
                <CFormSelect
                  aria-label="Default select example"
                  options={[
                    'Search All',
                    { label: 'surveyId', value: '1' },
                    { label: 'Question', value: '2' },
                    { label: 'wordType', value: '3' }
                  ]}
                  onChange={(e) => setFilterType(e.target.value)}
                />
              </CForm>

              <div className="result-count">
                <p>#Results: {filterResultCount}</p>
              </div>
            </div> */}
            {/* <DocsExample href="components/table"> */}
            <CTable align="middle" responsive>
            <CTableBody>
              {header()}
              {/* {(Object.keys(adMgmtData).length !== 0) ? rows : null} */}
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
          {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default LangMgmt
