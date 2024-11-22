import React, { useCallback, useEffect } from "react"
import "./App.css"
import { TodolistsList } from "features/TodolistsList/TodolistsList"
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar"
import { useDispatch, useSelector } from "react-redux"
import { initializeAppTC, selectAppStatus, selectIsInitialized } from "app/appSlice"
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { Login } from "features/Login/Login"
import { logoutTC, selectIsLoggedIn } from "features/Login/authSlice"
import { Button, CircularProgress, Container, LinearProgress } from "@mui/material"


function App() {
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIsInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useDispatch<any>()

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [dispatch])

  const logoutHandler = useCallback(() => {
    dispatch(logoutTC())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%"
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <ErrorSnackbar />
        {isLoggedIn && (
          <Button style={{ margin: "10px" }} variant={"contained"} onClick={logoutHandler}>
            Log out
          </Button>
        )}
        {status === "loading" &&
          <div className="progressWrapper"><LinearProgress
            style={{ position: "fixed", top: 0, left: 0, right: 0 }} /></div>
        }
        <Container fixed>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={isLoggedIn ? <TodolistsList /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  )
}

export default App
