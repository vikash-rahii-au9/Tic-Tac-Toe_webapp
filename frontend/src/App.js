import React from 'react';

import './App.css';
import {BrowserRouter as Router,
        Switch,
        Route,
        Link} from 'react-router-dom';
import Landing from './Display/landing';
import CreateSession from './Display/createSession';
import JoinSession from './Display/joinSession';
import Lobby from './Display/Lobby';
import {motion,AnimatePresence} from 'framer-motion';
import Container from './Display/Container';
import Stats from './Display/Stats';

//text selection: shift + left/right keys
//block moving: ctrl + [/]

function App() {
  
  

  return (
    
    <Container/>
  );
}

export default App;
