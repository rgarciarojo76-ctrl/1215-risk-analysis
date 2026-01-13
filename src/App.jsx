import { useState } from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import './App.css'

import Gatekeeper from './components/Gatekeeper';

function App() {
    return (
        <Gatekeeper>
            <DashboardLayout />
        </Gatekeeper>
    )
}

export default App
