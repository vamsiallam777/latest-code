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
  FormControlLabel,
  Switch,
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

function Invigilator() {  
  const [invigilators, setInvigilators] = useState([]);
  const [filteredInvigilators, setFilteredInvigilators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    phoneNumber: '',
    designation: '',
    available: true
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
    fetchInvigilators();
  }, []);

  // Filter invigilators when search query or invigilators list changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredInvigilators(invigilators);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = invigilators.filter(
      invigilator => 
        invigilator.name?.toLowerCase().includes(query) || 
        invigilator.email?.toLowerCase().includes(query) || 
        invigilator.phoneNumber?.toLowerCase().includes(query) || 
        invigilator.employeeId?.toLowerCase().includes(query)
    );
    
    setFilteredInvigilators(filtered);
  }, [searchQuery, invigilators]);

  const fetchInvigilators = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/invigilators', {
        headers: headers
      });
      
      if (response.status === 401) {
        // Handle unauthorized
        return;
      }
      const data = await response.json();
      setInvigilators(data);
      setFilteredInvigilators(data);
    } catch (error) {
      console.error('Error fetching invigilators:', error);
      showSnackbar('Error fetching invigilators', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (invigilator = null) => {
    if (invigilator) {
      setFormData({ ...invigilator });
      setIsEditing(true);
      setCurrentId(invigilator.id);
    } else {      
      setFormData({
        name: '',
        email: '',
        employeeId: '',
        department: '',
        phoneNumber: '',
        designation: '',
        available: true
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
  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      available: e.target.checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:8081/api/invigilators/${currentId}`
        : 'http://localhost:8081/api/invigilators';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        handleCloseDialog();
        fetchInvigilators();
        showSnackbar(
          `Invigilator successfully ${isEditing ? 'updated' : 'created'}!`,
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
    if (window.confirm('Are you sure you want to delete this invigilator?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/invigilators/${id}`, {
          method: 'DELETE',
          headers: headers
        });

        if (response.ok) {
          fetchInvigilators();
          showSnackbar('Invigilator deleted successfully', 'success');
        } else {
          const data = await response.json();
          showSnackbar(data.error || 'Delete operation failed', 'error');
        }
      } catch (error) {
        console.error('Error deleting invigilator:', error);
        showSnackbar('Error deleting invigilator', 'error');
      }
    }
  };
  
  const handleAvailabilityToggle = async (id, isAvailable) => {
    try {
      // Find the current invigilator
      const invigilator = invigilators.find(inv => inv.id === id);
      if (!invigilator) return;
      
      // Create updated invigilator data
      const updatedData = {
        ...invigilator,
        available: isAvailable
      };
      
      const response = await fetch(`http://localhost:8081/api/invigilators/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        // Update the local state to avoid a full refetch
        setInvigilators(invigilators.map(inv => 
          inv.id === id ? {...inv, available: isAvailable} : inv
        ));
        showSnackbar(`Invigilator status changed to ${isAvailable ? 'Available' : 'Unavailable'}`, 'success');
      } else {
        const data = await response.json();
        showSnackbar(data.error || 'Failed to update availability', 'error');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      showSnackbar('Error updating availability', 'error');
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
        Invigilators Management
      </Typography>      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search by name, email, employee ID, or phone..."
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
          Add Invigilator
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Designation</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{
              filteredInvigilators.length > 0 ? 
                filteredInvigilators.map((invigilator, index) => (
                  <TableRow key={invigilator.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{invigilator.name}</TableCell>
                    <TableCell>{invigilator.email}</TableCell>
                    <TableCell>{invigilator.employeeId}</TableCell>
                    <TableCell>{invigilator.department}</TableCell>
                    <TableCell>{invigilator.phoneNumber}</TableCell>
                    <TableCell>{invigilator.designation || 'N/A'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={invigilator.available}
                        onChange={(e) => handleAvailabilityToggle(invigilator.id, e.target.checked)}
                        color={invigilator.available ? "success" : "error"}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4caf50',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#4caf50',
                          },
                          '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                            color: '#f44336',
                          },
                          '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                            backgroundColor: '#f44336',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small" onClick={() => handleOpenDialog(invigilator)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(invigilator.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) : 
                <TableRow><TableCell colSpan={9} sx={{ textAlign: 'center', py: 3 }}>No invigilators found</TableCell></TableRow>
            }</TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Invigilator' : 'Add New Invigilator'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            margin="normal"
          />          
          <FormControlLabel
            control={
              <Switch 
                checked={formData.available}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Available for Duty"
            sx={{ mt: 2 }}
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

export default Invigilator;