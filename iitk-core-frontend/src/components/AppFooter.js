import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="/dashboard" rel="noopener noreferrer">
          IITK Lang Cog v2
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://sites.google.com/view/langcoglabiitk/home" target="_blank" rel="noopener noreferrer">
          IITK Language Cognition Team
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
