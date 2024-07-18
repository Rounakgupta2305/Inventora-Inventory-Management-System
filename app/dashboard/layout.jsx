import React from 'react'
import TransitionProvider from "@/components/transitionProvider";
function DashboardLayout({children}) {
  return (
    <div>
      <div>
        <div>
          <TransitionProvider>{children}</TransitionProvider>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout