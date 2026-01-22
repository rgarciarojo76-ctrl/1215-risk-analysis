import { useState } from 'react'
import WizardContainer from './components/RD1215/WizardContainer'
import './App.css'

import Gatekeeper from './components/Gatekeeper';

function App() {
    return (
        <Gatekeeper>
            <WizardContainer />
        </Gatekeeper>
    )
}

export default App
