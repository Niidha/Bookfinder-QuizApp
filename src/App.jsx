import './App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom"
import QuizApp from './Quiz-app/quiz'
import BookFinder from './Book-finder/bookFinder'



function App() {
 

  return <BrowserRouter>
  <Routes>
    <Route path='/quiz' Component={QuizApp}/>
    <Route path='/book' Component={BookFinder}/>
    {/* <Route path='/books' Component={BookFinders}/> */}
 
   
  </Routes>
  </BrowserRouter>
}

export default App
