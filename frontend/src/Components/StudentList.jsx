import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Container, Grid, Alert, Snackbar
} from '@mui/material';
import { FaEdit, FaTrash, FaDownload, FaUpload, FaPlus } from 'react-icons/fa';

const BASE_API_URL = 'http://localhost:8081';
const API_URL = `${BASE_API_URL}/api`;

const StudentList = () => {
  const { sectionId } = useParams();
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [apiPort, setApiPort] = useState('8081'); // Default port
  const [currentStudent, setCurrentStudent] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    phoneNumber: '',
    sectionId: sectionId
  });
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    fetchStudents();
  }, [sectionId]);
  
  // Helper function to try different ports if the main one isn't working
  const tryAlternativePort = () => {
    // If we're already on 8081, try 8080
    if (apiPort === '8081') {
      setApiPort('8080');
      setError('Trying alternative port 8080...');
      setTimeout(() => {
        fetchStudentsWithPort('8080');
      }, 1000);
    } else {
      setError('Could not connect to the server on ports 8081 or 8080. Please verify your backend is running.');
    }
  };
  
  const fetchStudentsWithPort = async (port) => {
    try {
      const token = localStorage.getItem('token');
      const altApiUrl = `http://localhost:${port}/api`;
      
      console.log(`Trying alternative port ${port}...`);
      console.log('Using API URL:', altApiUrl);
      
      const response = await axios.get(`${altApiUrl}/students/section/${sectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      
      console.log('Response received:', response.data);
      setStudents(response.data);
      setError('');
      setSuccess(`Connected successfully on port ${port}`);
      
      // Update the API_URL for future requests
      window.API_URL = altApiUrl;
      
    } catch (error) {
      console.error(`Error with port ${port}:`, error);
      if (port === '8081') {
        // If the primary port failed, try the alternative
        tryAlternativePort();
      } else {
        setError(`Could not connect to the server on port ${port}. Please check your backend configuration.`);
      }
    }
  };  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      // Add debugging info
      console.log('Fetching students for section:', sectionId);
      console.log('Using API URL:', API_URL);
      console.log('Authorization token:', token);
      
      // Use window.API_URL if it has been set by our port switching logic
      const currentApiUrl = window.API_URL || API_URL;
      
      const response = await axios.get(`${currentApiUrl}/students/section/${sectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        // Add timeout to avoid hanging requests
        timeout: 5000
      });
      
      console.log('Response received:', response.data);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.code === 'ERR_NETWORK') {
        console.log('Network error, trying alternative port...');
        // Try the alternative port
        tryAlternativePort();
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      } else {
        setError('Failed to fetch students: ' + error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentStudent({
      name: '',
      email: '',
      registrationNumber: '',
      phoneNumber: '',
      sectionId: sectionId
    });
  };

  const handleShowModal = (student = null) => {
    if (student) {
      setCurrentStudent(student);
      setIsEditing(true);
    } else {
      setCurrentStudent({
        name: '',
        email: '',
        registrationNumber: '',
        phoneNumber: '',
        sectionId: sectionId
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Use current API URL (either default or the one that worked)
      const currentApiUrl = window.API_URL || API_URL;
      
      if (isEditing) {
        await axios.put(`${currentApiUrl}/students/${currentStudent.id}`, currentStudent, { headers });
        setSuccess('Student updated successfully');
      } else {
        await axios.post(`${currentApiUrl}/students`, currentStudent, { headers });
        setSuccess('Student added successfully');
      }
      fetchStudents();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/students/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        setError(error.response?.data?.error || 'Failed to delete student');
      }
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      window.open(`${API_URL}/students/section/${sectionId}/export?token=${token}`);
      setSuccess('Downloading students data');
    } catch (error) {
      console.error('Error exporting students:', error);
      setError('Failed to export students');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/students/section/${sectionId}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      setSuccess('Students imported successfully');
      fetchStudents();
      setShowUploadModal(false);
      setFile(null);
    } catch (error) {
      console.error('Error importing students:', error);
      setError(error.response?.data?.error || 'Failed to import students');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Students in Section</Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<FaPlus />} 
              onClick={() => handleShowModal()}
              sx={{ mr: 1 }}
            >
              Add Student
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<FaUpload />} 
              onClick={() => setShowUploadModal(true)}
              sx={{ mr: 1 }}
            >
              Import from Excel
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="info" 
              startIcon={<FaDownload />} 
              onClick={handleExport}
              sx={{ mr: 1 }}
            >
              Export to Excel
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined" 
              startIcon={<FaDownload />} 
              onClick={() => window.open(`${API_URL}/students/template`)}
            >
              Download Template
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="warning" 
                      size="small"
                      startIcon={<FaEdit />}
                      onClick={() => handleShowModal(student)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small"
                      startIcon={<FaTrash />}
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No students found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Student Add/Edit Modal */}
      <Dialog 
        open={showModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditing ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={currentStudent.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              name="email"
              value={currentStudent.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Registration Number"
              name="registrationNumber"
              value={currentStudent.registrationNumber}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phoneNumber"
              value={currentStudent.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleSubmit}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* File Upload Modal */}
      <Dialog
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Import Students from Excel
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Excel File
              </Typography>
              <TextField
                fullWidth
                type="file"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  accept: '.xlsx, .xls',
                }}
                onChange={handleFileChange}
                required
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Excel file should have columns: Name, Email, Registration Number, Phone Number
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError('');
          setSuccess('');
        }}
      >
        <Alert 
          severity={error ? "error" : "success"}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentList;