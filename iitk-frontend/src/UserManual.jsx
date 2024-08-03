import React from 'react'
import ReactPDF from 'react-pdf'; // Adjust the import based on the actual module

function UserManual() {
  const pdf_path = "./User_Manual.pdf";
  return (
    <div>
      {/* <ReactPDF
        file={{
          url: {pdf_path}
        }}
      /> */}
      {/* <object data={pdf_path} type="application/pdf" width="100%" height="100%">
          <p>Alternative text - include a link <a href={pdf_path}>to the PDF!</a></p>
      </object> */}
      <embed src={pdf_path} style={{ margin: "0 !important", border: "0", width: "99vw", height: "97vh" }} type="application/pdf" />
    </div>
  )
}

export default UserManual;
