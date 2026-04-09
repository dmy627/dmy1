import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Assessment from './pages/Assessment';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/courses"
          element={
            <Layout>
              <Courses />
            </Layout>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <Layout>
              <CourseDetail />
            </Layout>
          }
        />
        <Route
          path="/learn/:courseId/:chapterId"
          element={
            <Layout>
              <Learn />
            </Layout>
          }
        />
        <Route
          path="/practice/:courseId/:exerciseId"
          element={
            <Layout>
              <Practice />
            </Layout>
          }
        />
        <Route
          path="/assessment/:courseId/:assessmentId"
          element={
            <Layout>
              <Assessment />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/profile/:tab"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;