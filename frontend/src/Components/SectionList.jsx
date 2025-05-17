import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, CircularProgress, Collapse, Grid, 
  Card, CardContent, Divider
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Add as AddIcon
} from '@mui/icons-material';

const API_URL = 'http://localhost:8081/api';

const buttonStyle = {
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  }
};

// Function to get the correct ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (num) => {
  if (!num) return '';
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};

const SectionList = () => {
  const { branchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState({
    name: '',
    branchId: branchId
  });
  const [currentStudent, setCurrentStudent] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    phoneNumber: '',
    sectionId: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: '',
    severity: 'success'
  });
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    fetchSections();
    console.log("Location state received:", location.state);
  }, [branchId]);  const fetchSections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/sections/branch/${branchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the sections data to see what we're working with
      console.log("Sections from API:", response.data);
      
      // Make sure we have valid section names before processing
      const validSections = response.data.map(section => ({
        ...section,
        // Ensure name is not undefined, use an empty string as fallback
        name: section.name || section.sectionName || ''
      }));
      
      console.log("Valid sections:", validSections);
      
      // Add formatted names to sections if we have branch name from location state
      if (location.state?.branchName) {
        const branchName = location.state.branchName;
        console.log("Using branch name:", branchName);
        
        const sectionsWithFormattedNames = validSections.map(section => ({
          ...section,
          formattedName: `${branchName}-${section.name}`
        }));
        
        setSections(sectionsWithFormattedNames);
        console.log("Sections with formatted names:", sectionsWithFormattedNames);
      } else {
        setSections(validSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSnackbarData({
        message: 'Failed to fetch sections',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditing(false);
    setCurrentSection({
      name: '',
      branchId: branchId
    });
  };

  const handleOpenDialog = (section = null) => {
    if (section) {
      setCurrentSection(section);
      setIsEditing(true);
    } else {
      setCurrentSection({
        name: '',
        branchId: branchId
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleInputChange = (e) => {
    setCurrentSection({ ...currentSection, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      if (isEditing) {
        await axios.put(`${API_URL}/sections/${currentSection.id}`, currentSection, { headers });
        setSnackbarData({
          message: 'Section updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_URL}/sections`, currentSection, { headers });
        setSnackbarData({
          message: 'Section added successfully',
          severity: 'success'
        });
      }
      fetchSections();
      handleCloseDialog();
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarData({
        message: error.response?.data?.error || 'An error occurred',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/sections/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSnackbarData({
          message: 'Section deleted successfully',
          severity: 'success'
        });
        setSnackbarOpen(true);
        fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        setSnackbarData({
          message: error.response?.data?.error || 'Failed to delete section',
          severity: 'error'
        });
        setSnackbarOpen(true);
      }
    }
  };

  const handleManageStudents = async (sectionId) => {
    if (expandedSectionId === sectionId) {
      // If already expanded, collapse it
      setExpandedSectionId(null);
    } else {
      // Otherwise, expand it and fetch students
      setExpandedSectionId(sectionId);
      setLoadingStudents(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/students/section/${sectionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setSnackbarData({
          message: 'Failed to fetch students',
          severity: 'error'
        });
        setSnackbarOpen(true);
      } finally {
        setLoadingStudents(false);
      }
    }
  };
  
  const handleAddStudent = (sectionId) => {
    setCurrentStudent({
      name: '',
      email: '',
      registrationNumber: '',
      phoneNumber: '',
      sectionId: sectionId
    });
    setIsEditingStudent(false);
    setStudentDialogOpen(true);
  };
  
  const handleEditStudent = (student) => {
    setCurrentStudent({
      ...student
    });
    setIsEditingStudent(true);
    setStudentDialogOpen(true);
  };
  
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      if (isEditingStudent) {
        await axios.put(`${API_URL}/students/${currentStudent.id}`, currentStudent, { headers });
        setSnackbarData({
          message: 'Student updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post(`${API_URL}/students`, currentStudent, { headers });
        setSnackbarData({
          message: 'Student added successfully',
          severity: 'success'
        });
      }
      handleCloseStudentDialog();
      handleManageStudents(currentStudent.sectionId);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarData({
        message: error.response?.data?.error || 'An error occurred',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };
    const handleDeleteStudent = async (studentId, sectionId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/students/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSnackbarData({
          message: 'Student deleted successfully',
          severity: 'success'
        });
        setSnackbarOpen(true);
        
        // Instead of calling handleManageStudents which would toggle the expansion
        // Just fetch the updated list of students directly
        try {
          const response = await axios.get(`${API_URL}/students/section/${sectionId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setStudents(response.data);
        } catch (error) {
          console.error('Error refreshing student list:', error);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        setSnackbarData({
          message: error.response?.data?.error || 'Failed to delete student',
          severity: 'error'
        });
        setSnackbarOpen(true);
      }
    }
  };
  
  const handleUploadExcel = (sectionId) => {
    setCurrentStudent({...currentStudent, sectionId: sectionId});
    setSelectedFile(null);
    setUploadDialogOpen(true);
  };
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setSnackbarData({
        message: 'Please select a file',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    // Note: We don't need to append sectionId as a form parameter since it's in the URL path
    
    try {
      const token = localStorage.getItem('token');
      // Using the correct endpoint with sectionId in the URL path
      await axios.post(`${API_URL}/students/section/${currentStudent.sectionId}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setSnackbarData({
        message: 'Students imported successfully',
        severity: 'success'
      });
      setSnackbarOpen(true);
      setUploadDialogOpen(false);
      
      // Instead of using handleManageStudents which would toggle expansion,
      // directly fetch the updated student list
      try {
        const response = await axios.get(`${API_URL}/students/section/${currentStudent.sectionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error refreshing student list:', error);
      }
    } catch (error) {
      console.error('Error importing students:', error);
      setSnackbarData({
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to import students',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };
  
  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/students/template`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading template:', error);
      setSnackbarData({
        message: 'Failed to download template',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };
  
  const handleCloseStudentDialog = () => {
    setStudentDialogOpen(false);
    setIsEditingStudent(false);
    setCurrentStudent({
      name: '',
      email: '',
      registrationNumber: '',
      phoneNumber: '',
      sectionId: null
    });
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: 'center', 
          color: '#1e3c72', 
          mb: 2,
          fontWeight: 'bold' 
        }}
      >
        Sections
      </Typography>
        {location.state?.programName && location.state?.yearName && location.state?.branchName && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>          <Typography variant="h6" color="text.secondary">
            {location.state.programName} | {location.state.yearNumber ? `${location.state.yearNumber} Year` : location.state.yearName} | {location.state.branchName}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
      </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 2, mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1e3c72' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Program</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Year</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Branch</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Section</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <TableRow hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{location.state?.programName || 'N/A'}</TableCell>
                    <TableCell>{location.state?.yearName || 'N/A'}</TableCell>
                    <TableCell>{location.state?.branchName || 'N/A'}</TableCell>
                    <TableCell>
                      {section.formattedName || 
                       (location.state?.branchName && section.name ? 
                        `${location.state.branchName}-${section.name}` : 
                        section.name)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="contained"
                        color="info" 
                        size="small"
                        fullWidth
                        onClick={() => handleManageStudents(section.id)}
                        startIcon={expandedSectionId === section.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      >
                        Manage Students
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedSectionId === section.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          {loadingStudents ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                              <CircularProgress />
                            </Box>
                          ) : (
                            <>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                mb: 2 
                              }}>
                                <Typography variant="h6" gutterBottom>
                                  Students in this Section
                                </Typography>
                                <Box>
                                  <Button 
                                    variant="contained" 
                                    color="success" 
                                    size="small" 
                                    sx={{ mr: 1 }}
                                    onClick={() => handleAddStudent(section.id)}
                                    startIcon={<AddIcon />}
                                  >
                                    Add Student
                                  </Button>
                                  <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small" 
                                    sx={{ mr: 1 }}
                                    onClick={() => handleUploadExcel(section.id)}
                                    startIcon={<FileUploadIcon />}
                                  >
                                    Import
                                  </Button>
                                  <Button 
                                    variant="outlined" 
                                    color="info" 
                                    size="small"
                                    onClick={handleDownloadTemplate}
                                    startIcon={<FileDownloadIcon />}
                                  >
                                    Template
                                  </Button>
                                </Box>
                              </Box>
                              {students.length > 0 ? (
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Registration Number</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {students.map((student, idx) => (
                                        <TableRow key={student.id} hover>
                                          <TableCell>{idx + 1}</TableCell>
                                          <TableCell>{student.name}</TableCell>
                                          <TableCell>{student.email}</TableCell>
                                          <TableCell>{student.registrationNumber}</TableCell>
                                          <TableCell>{student.phoneNumber}</TableCell>
                                          <TableCell>
                                            <IconButton 
                                              color="primary" 
                                              size="small" 
                                              sx={{ mr: 1 }}
                                              onClick={() => handleEditStudent(student)}
                                            >
                                              <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                              color="error" 
                                              size="small"
                                              onClick={() => handleDeleteStudent(student.id, section.id)}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                  No students found in this section
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                  No sections found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Section Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Edit Section' : 'Add New Section'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            type="text"
            fullWidth
            value={currentSection.name}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={buttonStyle}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Dialog */}      <Dialog open={studentDialogOpen} onClose={handleCloseStudentDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          {/* Show section context information */}
          {expandedSectionId && sections.find(s => s.id === expandedSectionId) && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(42, 82, 152, 0.1)', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Section: <Typography component="span" fontWeight="bold">
                  {sections.find(s => s.id === expandedSectionId).formattedName || 
                   `${location.state?.branchName || ''}-${sections.find(s => s.id === expandedSectionId).name}`}
                </Typography>
              </Typography>
              {location.state?.programName && (
                <Typography variant="subtitle2" color="text.secondary">
                  Program: <Typography component="span" fontWeight="bold">{location.state.programName}</Typography>
                </Typography>
              )}              {(location.state?.yearNumber || location.state?.yearName) && (
                <Typography variant="subtitle2" color="text.secondary">
                  Year: <Typography component="span" fontWeight="bold">
                    {location.state.yearNumber ? `${location.state.yearNumber} Year` : location.state.yearName}
                  </Typography>
                </Typography>
              )}
            </Box>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={currentStudent.name}
            onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentStudent.email}
            onChange={(e) => setCurrentStudent({...currentStudent, email: e.target.value})}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Registration Number"
            type="text"
            fullWidth
            value={currentStudent.registrationNumber}
            onChange={(e) => setCurrentStudent({...currentStudent, registrationNumber: e.target.value})}
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            value={currentStudent.phoneNumber}
            onChange={(e) => setCurrentStudent({...currentStudent, phoneNumber: e.target.value})}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudentDialog} color="inherit">Cancel</Button>
          <Button onClick={handleStudentSubmit} variant="contained" color="primary" sx={buttonStyle}>
            {isEditingStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Students from Excel</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Upload an Excel file with student data. The file should follow the template format.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="contained" 
              color="info" 
              onClick={handleDownloadTemplate}
              startIcon={<FileDownloadIcon />}
              size="small"
            >
              Download Template
            </Button>
          </Box>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ width: '100%' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Only Excel files (.xlsx, .xls) are supported
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleFileUpload} variant="contained" color="primary" sx={buttonStyle}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarData.severity}
          sx={{ width: '100%' }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SectionList;