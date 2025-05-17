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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Stack,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { format } from 'date-fns';

const buttonStyle = {
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  }
};

const EXAM_TYPES = ['MIDTERM', 'SEMESTER'];
const SET_TYPES = ['NO_SET', 'SET1', 'SET2'];

function Exam() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [formData, setFormData] = useState({
    examName: '',
    examDate: null,
    startTime: null,
    endTime: null,
    subjectId: '',
    examType: '',
    setType: '',
    programId: '',
    yearId: '',
    branchIds: [],
    sectionIds: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: '',
    severity: 'success'
  });
  // Get token function to ensure we always have the latest token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredExams(exams);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = exams.filter(exam => 
      exam.examName?.toLowerCase().includes(query) ||
      exam.subjectName?.toLowerCase().includes(query) ||
      exam.subjectCode?.toLowerCase().includes(query)
    );
    
    setFilteredExams(filtered);
  }, [searchQuery, exams]);
  const fetchExams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/exams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        console.error('Authentication failed when fetching exams');
        showSnackbar('Authentication failed. Please log in again.', 'error');
        return;
      }
      
      if (!response.ok) {
        console.error('Failed to fetch exams:', response.statusText);
        showSnackbar(`Error: ${response.statusText}`, 'error');
        return;
      }
      
      const data = await response.json();
      setExams(data);
      setFilteredExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      showSnackbar('Error fetching exams', 'error');
    } finally {
      setLoading(false);
    }
  };
  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/subjects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        console.error('Authentication failed when fetching subjects');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        console.error('Failed to fetch subjects:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/programs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        console.error('Authentication failed when fetching programs');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      } else {
        console.error('Failed to fetch programs:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };
  const fetchYears = async (programId) => {
    if (!programId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/years/program/${programId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        console.error('Authentication failed when fetching years');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setYears(data);
      } else {
        console.error('Failed to fetch years:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };
  const fetchBranches = async (programId, yearId) => {
    if (!programId || !yearId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/branches/program/${programId}/year/${yearId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        console.error('Authentication failed when fetching branches');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
        setFilteredBranches(data);
      } else {
        console.error('Failed to fetch branches:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };
  const fetchSections = async (branchIds) => {
    if (!branchIds || branchIds.length === 0) {
      setSections([]);
      setFilteredSections([]);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      // We need to fetch sections for each branch and combine them
      const sectionsPromises = branchIds.map(branchId => 
        fetch(`http://localhost:8081/api/sections/branch/${branchId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          if (!res.ok) {
            if (res.status === 401) {
              console.error('Authentication failed when fetching sections');
              return [];
            }
            console.error(`Failed to fetch sections for branch ${branchId}:`, res.statusText);
            return [];
          }
          return res.json();
        })
        .catch(err => {
          console.error(`Error fetching sections for branch ${branchId}:`, err);
          return [];
        })
      );
      
      const sectionsArrays = await Promise.all(sectionsPromises);
      const allSections = sectionsArrays.flat();
      
      setSections(allSections);
      setFilteredSections(allSections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };
  const handleOpenDialog = (exam = null) => {
    resetFormErrors();
    if (exam) {
      const examDate = exam.examDate ? new Date(exam.examDate) : null;
      const startTime = exam.startTime ? parseTimeString(exam.startTime) : null;
      const endTime = exam.endTime ? parseTimeString(exam.endTime) : null;
      
      setFormData({
        examName: exam.examName,
        examDate,
        startTime,
        endTime,
        subjectId: exam.subjectId,
        examType: exam.examType,
        setType: exam.setType,
        programId: exam.programId,
        yearId: exam.yearId,
        branchIds: exam.branchIds || [],
        sectionIds: exam.sectionIds || []
      });
      
      setIsEditing(true);
      setCurrentId(exam.id);
      
      // Fetch dependent data
      fetchYears(exam.programId);
      
      // Use setTimeout to ensure years are fetched before fetching branches
      setTimeout(() => {
        fetchBranches(exam.programId, exam.yearId);
        
        // Use another setTimeout to ensure branches are fetched before fetching sections
        setTimeout(() => {
          if (exam.branchIds && exam.branchIds.length > 0) {
            fetchSections(exam.branchIds);
          }
        }, 300);
      }, 300);
    } else {
      setFormData({
        examName: '',
        examDate: null,
        startTime: null,
        endTime: null,
        subjectId: '',
        examType: '',
        setType: '',
        programId: '',
        yearId: '',
        branchIds: [],
        sectionIds: []
      });
      setIsEditing(false);
      setYears([]);
      setBranches([]);
      setSections([]);
    }
    setDialogOpen(true);
  };

  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return date;
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetFormErrors();
  };

  const resetFormErrors = () => {
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }

    // Handle cascading selects
    if (name === 'programId') {
      setFormData(prev => ({
        ...prev,
        yearId: '',
        branchIds: [],
        sectionIds: []
      }));
      fetchYears(value);
    }
    
    if (name === 'yearId') {
      setFormData(prev => ({
        ...prev,
        branchIds: [],
        sectionIds: []
      }));
      fetchBranches(formData.programId, value);
    }
    
    if (name === 'branchIds') {
      setFormData(prev => ({
        ...prev,
        sectionIds: []
      }));
      fetchSections(value);
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      examDate: date
    });
    
    // Clear any error for this field
    if (formErrors.examDate) {
      setFormErrors({
        ...formErrors,
        examDate: null
      });
    }
  };

  const handleTimeChange = (name, time) => {
    setFormData({
      ...formData,
      [name]: time
    });
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const formatTime = (date) => {
    if (!date) return null;
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.examType) errors.examType = 'Exam type is required';
    if (!formData.subjectId) errors.subjectId = 'Subject is required';
    if (!formData.setType) errors.setType = 'Set type is required';
    if (!formData.examDate) errors.examDate = 'Exam date is required';
    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) errors.endTime = 'End time is required';
    if (!formData.programId) errors.programId = 'Program is required';
    if (!formData.yearId) errors.yearId = 'Year is required';
    if (!formData.branchIds || formData.branchIds.length === 0) errors.branchIds = 'At least one branch is required';
    if (!formData.sectionIds || formData.sectionIds.length === 0) errors.sectionIds = 'At least one section is required';
    
    // Check if end time is after start time
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        showSnackbar('Authentication token missing. Please log in again.', 'error');
        return;
      }
      
      // Generate exam name if not provided
      let examName = formData.examName;
      if (!examName || examName.trim() === '') {
        const subject = subjects.find(s => s.id === formData.subjectId);
        if (subject) {
          examName = `${subject.code} - ${subject.name} - ${formData.examType}`;
        }
      }
      
      const payload = {
        ...formData,
        examName,
        examDate: formData.examDate.toISOString().split('T')[0],
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime)
      };
      
      const url = isEditing 
        ? `http://localhost:8081/api/exams/${currentId}`
        : 'http://localhost:8081/api/exams';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        showSnackbar('Authentication failed. Please log in again.', 'error');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        handleCloseDialog();
        fetchExams();
        showSnackbar(
          `Exam successfully ${isEditing ? 'updated' : 'scheduled'}!`,
          'success'
        );
      } else {
        showSnackbar(data.error || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showSnackbar('Error scheduling exam', 'error');
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          showSnackbar('Authentication token missing. Please log in again.', 'error');
          return;
        }
        
        const response = await fetch(`http://localhost:8081/api/exams/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          showSnackbar('Authentication failed. Please log in again.', 'error');
          return;
        }

        if (response.ok) {
          fetchExams();
          showSnackbar('Exam deleted successfully', 'success');
        } else {
          const data = await response.json();
          showSnackbar(data.error || 'Delete operation failed', 'error');
        }
      } catch (error) {
        console.error('Error deleting exam:', error);
        showSnackbar('Error deleting exam', 'error');
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

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
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
        Exam Scheduling
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search by exam name, subject..."
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
          Schedule Exam
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Exam Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Set Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Program</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sections</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{filteredExams.length > 0 ? filteredExams.map((exam, index) => (
                <TableRow key={exam.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{exam.examName}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{exam.subjectCode}</Typography>
                    <Typography variant="body2" color="text.secondary">{exam.subjectName}</Typography>
                  </TableCell>
                  <TableCell>{formatDateDisplay(exam.examDate)}</TableCell>
                  <TableCell>{`${exam.startTime} - ${exam.endTime}`}</TableCell>
                  <TableCell>{exam.examType}</TableCell>
                  <TableCell>{exam.setType.replace('_', ' ')}</TableCell>
                  <TableCell>{exam.programName} - {exam.yearName}</TableCell>
                  <TableCell>
                    {exam.sectionNames && exam.sectionNames.length > 0 ? (
                      <Box sx={{ maxWidth: 200, overflowX: 'hidden' }}>
                        {exam.sectionNames.map((section, i) => (
                          <Chip 
                            key={i} 
                            label={section} 
                            size="small" 
                            sx={{ m: 0.2 }}
                          />
                        ))}
                      </Box>
                    ) : 'No sections'}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      size="small" 
                      onClick={() => handleOpenDialog(exam)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(exam.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={10} sx={{ textAlign: 'center', py: 3 }}>No exams scheduled</TableCell></TableRow>
            }</TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Exam Schedule' : 'Schedule New Exam'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!formErrors.examType}
              >
                <InputLabel id="exam-type-label">Exam Type</InputLabel>
                <Select
                  labelId="exam-type-label"
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  label="Exam Type"
                  required
                >
                  {EXAM_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.examType && <FormHelperText>{formErrors.examType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.subjectId}
              >
                <InputLabel id="subject-label">Subject</InputLabel>
                <Select
                  labelId="subject-label"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  label="Subject"
                  required
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.subjectId && <FormHelperText>{formErrors.subjectId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.setType}
              >
                <InputLabel id="set-type-label">Set Type</InputLabel>
                <Select
                  labelId="set-type-label"
                  name="setType"
                  value={formData.setType}
                  onChange={handleInputChange}
                  label="Set Type"
                  required
                >
                  {SET_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.setType && <FormHelperText>{formErrors.setType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Exam Name"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                margin="normal"
                helperText="Optional. If left blank, a name will be generated."
              />
            </Grid>
              <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Exam Date"
                  value={formData.examDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                      error: !!formErrors.examDate,
                      helperText: formErrors.examDate
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(time) => handleTimeChange('startTime', time)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                      error: !!formErrors.startTime,
                      helperText: formErrors.startTime
                    }
                  }}
                  views={["hours", "minutes"]}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={formData.endTime}
                  onChange={(time) => handleTimeChange('endTime', time)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      required: true,
                      error: !!formErrors.endTime,
                      helperText: formErrors.endTime
                    }
                  }}
                  views={["hours", "minutes"]}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.programId}
              >
                <InputLabel id="program-label">Program</InputLabel>
                <Select
                  labelId="program-label"
                  name="programId"
                  value={formData.programId}
                  onChange={handleInputChange}
                  label="Program"
                  required
                >
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.programName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.programId && <FormHelperText>{formErrors.programId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.yearId}
                disabled={!formData.programId}
              >
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  name="yearId"
                  value={formData.yearId}
                  onChange={handleInputChange}
                  label="Year"
                  required
                >
                  {years.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.yearName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.yearId && <FormHelperText>{formErrors.yearId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.branchIds}
                disabled={!formData.yearId}
              >
                <InputLabel id="branch-label">Branches</InputLabel>
                <Select
                  labelId="branch-label"
                  name="branchIds"
                  multiple
                  value={formData.branchIds}
                  onChange={handleInputChange}
                  input={<OutlinedInput label="Branches" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const branch = branches.find(b => b.id === value);
                        return branch ? (
                          <Chip key={value} label={branch.branchName} />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      <Checkbox checked={formData.branchIds.indexOf(branch.id) > -1} />
                      <ListItemText primary={branch.branchName} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.branchIds && <FormHelperText>{formErrors.branchIds}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={!!formErrors.sectionIds}
                disabled={!formData.branchIds.length}
              >
                <InputLabel id="section-label">Sections</InputLabel>
                <Select
                  labelId="section-label"
                  name="sectionIds"
                  multiple
                  value={formData.sectionIds}
                  onChange={handleInputChange}
                  input={<OutlinedInput label="Sections" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const section = sections.find(s => s.id === value);
                        return section ? (
                          <Chip key={value} label={section.formattedName || section.sectionName} />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {sections.map((section) => (
                    <MenuItem key={section.id} value={section.id}>
                      <Checkbox checked={formData.sectionIds.indexOf(section.id) > -1} />
                      <ListItemText primary={section.formattedName || section.sectionName} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.sectionIds && <FormHelperText>{formErrors.sectionIds}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={buttonStyle}
            startIcon={<EventIcon />}
          >
            {isEditing ? 'Update Exam' : 'Schedule Exam'}
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

export default Exam;