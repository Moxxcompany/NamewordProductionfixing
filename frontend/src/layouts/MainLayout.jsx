import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import LiveChat from '../components/LiveChat'
// import Loader from '../components/common/Loader'

const MainLayout = ({children}) => {
  return (
    <div>
      {/* <Loader /> */}
      <Navbar />
      <div className='px-5 mb-10'>
        {children}
      </div>
      <Footer />
      <LiveChat />
    </div>
  )
}

export default MainLayout
