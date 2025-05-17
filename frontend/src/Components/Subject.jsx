import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const buttonStyle = {
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  }
};

function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: '',
    severity: 'success'
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter subjects when search query or subjects list changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSubjects(subjects);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = subjects.filter(
      subject => 
        subject.name?.toLowerCase().includes(query) || 
        subject.code?.toLowerCase().includes(query)
    );
    
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/subjects', {
        headers: headers
      });
      
      if (response.status === 401) {
        // Handle unauthorized
        return;
      }
      
      const data = await response.json();
      setSubjects(data);
      setFilteredSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      showSnackbar('Error fetching subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setFormData({ ...subject });
      setIsEditing(true);
      setCurrentId(subject.id);
    } else {
      setFormData({
        name: '',
        code: ''
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.code) {
      showSnackbar('Subject name and code are required', 'error');
      return;
    }
    
    try {
      const url = isEditing 
        ? `http://localhost:8081/api/subjects/${currentId}`
        : 'http://localhost:8081/api/subjects';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        handleCloseDialog();
        fetchSubjects();
        showSnackbar(
          `Subject successfully ${isEditing ? 'updated' : 'created'}!`,
          'success'
        );
      } else {
        showSnackbar(data.error || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showSnackbar('Error submitting form', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/subjects/${id}`, {
          method: 'DELETE',
          headers: headers
        });

        if (response.ok) {
          fetchSubjects();
          showSnackbar('Subject deleted successfully', 'success');
        } else {
          const data = await response.json();
          showSnackbar(data.error || 'Delete operation failed', 'error');
        }
      } catch (error) {
        console.error('Error deleting subject:', error);
        showSnackbar('Error deleting subject', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: 'center', 
          color: '#1e3c72', 
          mb: 4,
          fontWeight: 'bold' 
        }}
      >
        Subjects Management
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search by name or code..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' } }}
          InputProps={{
            startAdornment: (
              <Box component="span" sx={{ color: 'action.active', mr: 1, my: 0.5 }}>
                🔍
              </Box>
            ),
          }}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
          sx={buttonStyle}
        >
          Add Subject
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#1e3c72' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject Code</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubjects.length > 0 ? filteredSubjects.map((subject, index) => (
                <TableRow key={subject.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell><strong>{subject.code}</strong></TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>
                    <IconButton color="primary" size="small" onClick={() => handleOpenDialog(subject)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(subject.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>No subjects found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Subject Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            margin="normal"
            required
            helperText="Unique code for the subject (e.g. CS101)"
          />
          <TextField
            fullWidth
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={buttonStyle}
          >
            {isEditing ? 'Update' : 'Add'}
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
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Subject;