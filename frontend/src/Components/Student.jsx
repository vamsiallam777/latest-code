import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Card, CardContent, MenuItem, Accordion, AccordionSummary,
  AccordionDetails, Divider, Select, FormControl, InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const buttonStyle = {
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  }
};

const cardStyle = {
  width: '100%',
  minHeight: '140px', // Set minimum height
  height: '100%',  
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': { 
    transform: 'translateY(-4px)', 
    boxShadow: 3 
  },
  // Add consistent padding
  p: 0,
  pb: 1
};

function Student() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  // Add accordion expansion state
  const [programsExpanded, setProgramsExpanded] = useState(true);
  const [yearsExpanded, setYearsExpanded] = useState(false);
  const [branchesExpanded, setBranchesExpanded] = useState(false);
  const [sectionsExpanded, setSectionsExpanded] = useState(false);
  
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [programFormData, setProgramFormData] = useState({
    programName: '',
    durationYears: 4
  });
  const [editingProgram, setEditingProgram] = useState(null);
  const [yearDialogOpen, setYearDialogOpen] = useState(false);
  const [yearFormData, setYearFormData] = useState({
    startYear: new Date().getFullYear(),
    yearNumber: 'First',
    programId: null
  });
  const [editingYear, setEditingYear] = useState(null);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [branchFormData, setBranchFormData] = useState({
    branchName: ''
  });
  const [editingBranch, setEditingBranch] = useState(null);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [sectionFormData, setSectionFormData] = useState({
    sectionName: '',
    capacity: 60
  });
  const [editingSection, setEditingSection] = useState(null);
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
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchPrograms();
  }, [navigate, token]);

  // Fetch Programs from API
  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/programs', {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
        // Reset child selections
        setSelectedProgram(null);
        setYears([]);
        setSelectedYear(null);
        setBranches([]);
        setSelectedBranch(null);
        setSections([]);
      } else {
        console.error('Failed to fetch programs');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  // Fetch Years by Program ID
  const fetchYearsByProgramId = async (programId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/years/program/${programId}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setYears(data);
        // Reset child selections
        setSelectedYear(null);
        setBranches([]);
        setSelectedBranch(null);
        setSections([]);
      } else {
        console.error('Failed to fetch years');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  // Fetch All Years (for admin purposes)
  const fetchAllYears = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/years', {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setYears(data);
      } else {
        console.error('Failed to fetch years');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  // Fetch Branches by Year ID
  const fetchBranches = async (yearId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/branches/year/${yearId}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
        setSections([]);
        setSelectedBranch(null);
      } else {
        console.error('Failed to fetch branches');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  // Fetch Sections by Branch ID
  const fetchSections = async (branchId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/sections/branch/${branchId}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        console.error('Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };
  // Program handlers
  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    fetchYearsByProgramId(program.id);
    setProgramsExpanded(false);
    setYearsExpanded(true);
    setBranchesExpanded(false);
    setSectionsExpanded(false);
  };

  const handleAddProgram = (e) => {
    if (e) e.stopPropagation();
    setEditingProgram(null);
    setProgramFormData({ programName: '', durationYears: 4 });
    setProgramDialogOpen(true);
  };

  const handleEditProgram = (program, e) => {
    if (e) e.stopPropagation();
    setEditingProgram(program);
    setProgramFormData({
      programName: program.programName,
      durationYears: program.durationYears || 4
    });
    setProgramDialogOpen(true);
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingProgram
        ? `http://localhost:8081/api/programs/${editingProgram.id}`
        : 'http://localhost:8081/api/programs';
      
      const method = editingProgram ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(programFormData),
      });
      
      if (response.ok) {
        fetchPrograms();
        setProgramDialogOpen(false);
        setSnackbarData({
          message: `Program ${editingProgram ? 'updated' : 'added'} successfully!`,
          severity: 'success'
        });
      } else {
        const error = await response.json();
        setSnackbarData({
          message: error.error || 'Failed to save program',
          severity: 'error'
        });
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDeleteProgram = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/programs/${id}`, {
          method: 'DELETE',
          headers
        });
        
        if (response.ok) {
          fetchPrograms();
          if (selectedProgram?.id === id) {
            setSelectedProgram(null);
            setYears([]);
            setSelectedYear(null);
            setBranches([]);
            setSelectedBranch(null);
            setSections([]);
          }
          setSnackbarData({
            message: 'Program deleted successfully!',
            severity: 'success'
          });
        } else {
          setSnackbarData({
            message: 'Failed to delete program',
            severity: 'error'
          });
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };
    // Year handlers
  const handleYearClick = async (year, e) => {
    if (e && e.target.closest('button')) {
      return;
    }
    setSelectedYear(year);
    await fetchBranches(year.id);
    setProgramsExpanded(false);
    setYearsExpanded(false);
    setBranchesExpanded(true);
    setSectionsExpanded(false);
  };
  
  const handleAddYear = (e) => {
    if (e) e.stopPropagation();
    if (!selectedProgram) {
      setSnackbarData({
        message: 'Please select a program first',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
    
    setEditingYear(null);
    setYearFormData({ 
      startYear: new Date().getFullYear(), 
      yearNumber: 'First',
      programId: selectedProgram.id 
    });
    setYearDialogOpen(true);
  };
  
  const handleEditYear = (year, e) => {
    if (e) e.stopPropagation();
    setEditingYear(year);
    // Extract start year from yearName format "2022-2026"
    const startYear = year.yearName ? parseInt(year.yearName.split('-')[0]) : new Date().getFullYear();
    setYearFormData({ 
      startYear: startYear,
      yearNumber: year.yearNumber || 'First',
      programId: year.programId
    });
    setYearDialogOpen(true);
  };
  
  const handleYearSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingYear
        ? `http://localhost:8081/api/years/${editingYear.id}`
        : 'http://localhost:8081/api/years';
      
      const method = editingYear ? 'PUT' : 'POST';
      
      // Calculate end year (start year + 4)
      const startYear = parseInt(yearFormData.startYear);
      const endYear = startYear + 4;
      const formattedYearName = `${startYear}-${endYear}`;
      
      const requestData = {
        ...yearFormData,
        yearName: formattedYearName
      };
      
      // Ensure programId is included
      if (!requestData.programId && selectedProgram) {
        requestData.programId = selectedProgram.id;
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });
        
      if (response.ok) {
        // Refresh years for the current selected program
        if (selectedProgram) {
          fetchYearsByProgramId(selectedProgram.id);
        } else {
          fetchAllYears();
        }
        setYearDialogOpen(false);
        setSnackbarData({
          message: `Year ${editingYear ? 'updated' : 'added'} successfully!`,
          severity: 'success'
        });
      } else {
        const error = await response.json();
        setSnackbarData({
          message: error.error || 'Failed to save year',
          severity: 'error'
        });
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving year:', error);
      setSnackbarData({
        message: 'Error saving year',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };
  
  const handleDeleteYear = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this year?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/years/${id}`, {
          method: 'DELETE',
          headers
        });
        
        if (response.ok) {
          if (selectedProgram) {
            fetchYearsByProgramId(selectedProgram.id);
          } else {
            fetchAllYears();
          }
          if (selectedYear?.id === id) {
            setSelectedYear(null);
            setBranches([]);
            setSections([]);
          }
          setSnackbarData({
            message: 'Year deleted successfully!',
            severity: 'success'
          });
        } else {
          setSnackbarData({
            message: 'Failed to delete year',
            severity: 'error'
          });
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting year:', error);
      }
    }
  };
  // Branch handlers
  const handleBranchClick = async (branch, e) => {
    if (e && e.target.closest('button')) {
      return;
    }
    setSelectedBranch(branch);
    await fetchSections(branch.id);
    setProgramsExpanded(false);
    setYearsExpanded(false);
    setBranchesExpanded(false);
    setSectionsExpanded(true);
  };

  const handleAddBranch = (e) => {
    if (e) e.stopPropagation();
    if (!selectedYear) {
      setSnackbarData({
        message: 'Please select a year first',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
    
    setEditingBranch(null);
    setBranchFormData({ branchName: '' });
    setBranchDialogOpen(true);
  };

  const handleEditBranch = (branch, e) => {
    if (e) e.stopPropagation();
    setEditingBranch(branch);
    setBranchFormData({ branchName: branch.branchName });
    setBranchDialogOpen(true);
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedYear) {
      setSnackbarData({
        message: 'Please select a year first',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const url = editingBranch
        ? `http://localhost:8081/api/branches/${editingBranch.id}`
        : 'http://localhost:8081/api/branches';
      
      const method = editingBranch ? 'PUT' : 'POST';
      
      const requestData = {
        ...branchFormData,
        yearId: selectedYear.id
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });
      
      if (response.ok) {
        fetchBranches(selectedYear.id);
        setBranchDialogOpen(false);
        setSnackbarData({
          message: `Branch ${editingBranch ? 'updated' : 'added'} successfully!`,
          severity: 'success'
        });
      } else {
        const error = await response.json();
        setSnackbarData({
          message: error.error || 'Failed to save branch',
          severity: 'error'
        });
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleDeleteBranch = async (branchId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/branches/${branchId}`, {
          method: 'DELETE',
          headers
        });
        
        if (response.ok) {
          fetchBranches(selectedYear.id);
          if (selectedBranch?.id === branchId) {
            setSelectedBranch(null);
            setSections([]);
          }
          setSnackbarData({
            message: 'Branch deleted successfully!',
            severity: 'success'
          });
        } else {
          setSnackbarData({
            message: 'Failed to delete branch',
            severity: 'error'
          });
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };  // Section handlers
  const handleSectionClick = (section) => {
    // Navigate to section details page with student management options
    console.log("Selected branch:", selectedBranch);
    console.log("Selected program:", selectedProgram);
    console.log("Selected year:", selectedYear);
    
    navigate(`/sections/branch/${selectedBranch.id}`, { 
      state: { 
        section: section,
        branchName: selectedBranch.branchName,
        programName: selectedProgram?.programName,
        yearName: selectedYear?.yearName,
        yearNumber: selectedYear?.yearNumber
      }
    });
  };

  const handleAddSection = (e) => {
    if (e) e.stopPropagation();
    if (!selectedBranch) {
      setSnackbarData({
        message: 'Please select a branch first',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
    
    setEditingSection(null);
    setSectionFormData({ sectionName: '', capacity: 60 });
    setSectionDialogOpen(true);
  };

  const handleEditSection = (section, e) => {
    if (e) e.stopPropagation();
    setEditingSection(section);
    setSectionFormData({
      sectionName: section.sectionName,
      capacity: section.capacity
    });
    setSectionDialogOpen(true);
  };
  
  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBranch) {
      setSnackbarData({
        message: 'Please select a branch first',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const url = editingSection
        ? `http://localhost:8081/api/sections/${editingSection.id}`
        : 'http://localhost:8081/api/sections';
      
      const method = editingSection ? 'PUT' : 'POST';
      
      // Send only the section name part (A, B, C) to backend
      const requestData = {
        ...sectionFormData,
        branchId: selectedBranch.id
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(requestData),
      });
      
      if (response.ok) {
        fetchSections(selectedBranch.id);
        setSectionDialogOpen(false);
        setSnackbarData({
          message: `Section ${editingSection ? 'updated' : 'added'} successfully!`,
          severity: 'success'
        });
      } else {
        const error = await response.json();
        setSnackbarData({
          message: error.error || 'Failed to save section',
          severity: 'error'
        });
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleDeleteSection = async (sectionId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/sections/${sectionId}`, {
          method: 'DELETE',
          headers
        });
        
        if (response.ok) {
          fetchSections(selectedBranch.id);
          setSnackbarData({
            message: 'Section deleted successfully!',
            severity: 'success'
          });
        } else {
          setSnackbarData({
            message: 'Failed to delete section',
            severity: 'error'
          });
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: 'center', 
          color: '#1e3c72', 
          mb: 4,
          fontWeight: 'bold' 
        }}
      >
        Manage Students
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 1300, mx: 'auto', px: { xs: 1, sm: 2 } }}>
        {/* Programs Accordion - Always visible */}        <Accordion 
          expanded={programsExpanded}
          onChange={(e, isExpanded) => {
            setProgramsExpanded(isExpanded);
            if (isExpanded) {
              setYearsExpanded(false);
              setBranchesExpanded(false);
              setSectionsExpanded(false);
            }
          }}
          sx={{ 
            mb: 2, 
            boxShadow: 2, 
            borderRadius: '8px',
            overflow: 'hidden',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            sx={{ 
              bgcolor: '#1e3c72', 
              color: 'white',
              '&.Mui-expanded': {
                minHeight: '64px'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Programs</Typography>
              <Button 
                variant="contained"
                onClick={(e) => handleAddProgram(e)}
                sx={{ 
                  ml: 2,
                  bgcolor: 'white', 
                  color: '#1e3c72',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
                size="small"
              >
                Add Program
              </Button>
            </Box>
          </AccordionSummary>          <AccordionDetails sx={{ p: 3 }}>            {programs.length > 0 ? (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, minmax(0, 1fr))', 
                    md: 'repeat(3, minmax(0, 1fr))' 
                  }, 
                  gridAutoRows: 'minmax(140px, auto)',
                  gap: 3,
                  width: '100%',
                  '& > *': { 
                    width: '100%',
                    height: '100%'
                  }
                }}>{programs.map((program) => (
                  <Box key={program.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>                    <Card 
                      sx={{
                        ...cardStyle,
                        height: '100%',
                        bgcolor: selectedProgram?.id === program.id ? 'primary.light' : 'background.paper',
                        color: selectedProgram?.id === program.id ? 'white' : 'inherit',
                        border: selectedProgram?.id === program.id ? '2px solid #1e3c72' : '1px solid #eee',
                      }}
                      onClick={() => handleProgramClick(program)}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1
                        }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{program.programName}</Typography>                          <Box>
                            <IconButton 
                              size="small"
                              onClick={(e) => handleEditProgram(program, e)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={(e) => handleDeleteProgram(program.id, e)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color={selectedProgram?.id === program.id ? 'white' : 'text.secondary'}
                        >
                          Duration: {program.durationYears} years
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: 'text.secondary'
              }}>
                <Typography variant="h6">No Programs Available</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Add your first program to get started</Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Years Accordion - Only visible when a program is selected */}
        {selectedProgram && (          <Accordion 
            expanded={yearsExpanded}
            onChange={(e, isExpanded) => {
              setYearsExpanded(isExpanded);
              if (isExpanded) {
                setProgramsExpanded(false);
                setBranchesExpanded(false);
                setSectionsExpanded(false);
              }
            }}
            sx={{ 
              mb: 2, 
              boxShadow: 2, 
              borderRadius: '8px',
              overflow: 'hidden',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              sx={{ 
                bgcolor: '#2a5298', 
                color: 'white',
                '&.Mui-expanded': {
                  minHeight: '64px'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Academic Years</Typography>
                  <Typography variant="subtitle1" sx={{ ml: 2, opacity: 0.9 }}>
                    ({selectedProgram.programName})
                  </Typography>
                </Box>
                <Button 
                  variant="contained"
                  onClick={(e) => handleAddYear(e)}
                  sx={{ 
                    ml: 2,
                    bgcolor: 'white', 
                    color: '#2a5298',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  size="small"
                >
                  Add Year
                </Button>
              </Box>
            </AccordionSummary>            <AccordionDetails sx={{ p: 3 }}>              {years.length > 0 ? (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, minmax(0, 1fr))', 
                    md: 'repeat(3, minmax(0, 1fr))' 
                  }, 
                  gridAutoRows: 'minmax(140px, auto)',
                  gap: 3,
                  width: '100%',
                  '& > *': { 
                    width: '100%',
                    height: '100%'
                  }
                }}>{years.map((year) => (
                    <Box key={year.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>                      <Card 
                        sx={{
                          ...cardStyle,
                          height: '100%',
                          bgcolor: selectedYear?.id === year.id ? 'primary.light' : 'background.paper',
                          color: selectedYear?.id === year.id ? 'white' : 'inherit',
                          border: selectedYear?.id === year.id ? '2px solid #2a5298' : '1px solid #eee',
                        }}
                        onClick={(e) => handleYearClick(year, e)}
                      >
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                          }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{year.yearName}</Typography>                            <Box>
                              <IconButton 
                                size="small"
                                onClick={(e) => handleEditYear(year, e)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={(e) => handleDeleteYear(year.id, e)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SchoolIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                            <Typography 
                              variant="body2"
                              color={selectedYear?.id === year.id ? 'white' : 'text.secondary'}
                            >
                              {year.yearNumber} Year
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6">No Academic Years Available</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Add a new academic year to this program</Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Branches Accordion - Only visible when a year is selected */}
        {selectedYear && (          <Accordion 
            expanded={branchesExpanded}
            onChange={(e, isExpanded) => {
              setBranchesExpanded(isExpanded);
              if (isExpanded) {
                setProgramsExpanded(false);
                setYearsExpanded(false);
                setSectionsExpanded(false);
              }
            }}
            sx={{ 
              mb: 2, 
              boxShadow: 2, 
              borderRadius: '8px',
              overflow: 'hidden',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              sx={{ 
                bgcolor: '#3a6db5', 
                color: 'white',
                '&.Mui-expanded': {
                  minHeight: '64px'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Branches</Typography>
                  <Typography variant="subtitle1" sx={{ ml: 2, opacity: 0.9 }}>
                    ({selectedYear.yearName}, {selectedYear.yearNumber} Year)
                  </Typography>
                </Box>
                <Button 
                  variant="contained"
                  onClick={(e) => handleAddBranch(e)}
                  sx={{ 
                    ml: 2,
                    bgcolor: 'white', 
                    color: '#3a6db5',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  size="small"
                >
                  Add Branch
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {branches.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Branch Name</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {branches.map((branch) => (                        <TableRow 
                          key={branch.id}
                          hover
                          onClick={(e) => handleBranchClick(branch, e)}
                          selected={selectedBranch?.id === branch.id}
                          sx={{ 
                            cursor: 'pointer',
                            '&.Mui-selected': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                              '& .MuiTableCell-root': {
                                color: 'white'
                              }
                            },
                            '&.Mui-selected:hover': {
                              backgroundColor: 'primary.light',
                              opacity: 0.95
                            }
                          }}
                        >
                          <TableCell>{branch.branchName}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small"
                              onClick={(e) => handleEditBranch(branch, e)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={(e) => handleDeleteBranch(branch.id, e)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6">No Branches Available</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Add a new branch to this academic year</Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Sections Accordion - Only visible when a branch is selected */}
        {selectedBranch && (          <Accordion 
            expanded={sectionsExpanded}
            onChange={(e, isExpanded) => {
              setSectionsExpanded(isExpanded);
              if (isExpanded) {
                setProgramsExpanded(false);
                setYearsExpanded(false);
                setBranchesExpanded(false);
              }
            }}
            sx={{ 
              mb: 2, 
              boxShadow: 2, 
              borderRadius: '8px',
              overflow: 'hidden',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              sx={{ 
                bgcolor: '#5282c7', 
                color: 'white',
                '&.Mui-expanded': {
                  minHeight: '64px'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Sections</Typography>
                  <Typography variant="subtitle1" sx={{ ml: 2, opacity: 0.9 }}>
                    ({selectedBranch.branchName})
                  </Typography>
                </Box>
                <Button 
                  variant="contained"
                  onClick={(e) => handleAddSection(e)}
                  sx={{ 
                    ml: 2,
                    bgcolor: 'white', 
                    color: '#5282c7',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  size="small"
                >
                  Add Section
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {sections.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Section Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sections.map((section) => (
                        <TableRow 
                          key={section.id}
                          hover
                          onClick={() => handleSectionClick(section)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(82, 130, 199, 0.1)'
                            }
                          }}
                        >
                          <TableCell>{section.formattedName || `${selectedBranch.branchName} - ${section.sectionName}`}</TableCell>
                          <TableCell>{section.capacity} students</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSection(section, e);
                              }}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSection(section.id, e);
                              }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6">No Sections Available</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Add a new section to this branch</Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Program Dialog */}
      <Dialog 
        open={programDialogOpen} 
        onClose={() => setProgramDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#1e3c72', color: 'white' }}>
          {editingProgram ? 'Edit Program' : 'Add New Program'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, width: 400, maxWidth: '100%' }}>
          <TextField
            fullWidth
            label="Program Name"
            value={programFormData.programName}
            onChange={(e) => setProgramFormData({ ...programFormData, programName: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., B.Tech, BBA, M.Tech"
          />
          <TextField
            fullWidth
            label="Duration (Years)"
            type="number"
            value={programFormData.durationYears}
            onChange={(e) => setProgramFormData({ 
              ...programFormData, 
              durationYears: parseInt(e.target.value, 10) || 4
            })}
            margin="normal"
            required
            InputProps={{ inputProps: { min: 1, max: 6 } }}
            helperText="Number of years for the program"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setProgramDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleProgramSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            {editingProgram ? 'Update' : 'Add'} Program
          </Button>
        </DialogActions>
      </Dialog>

      {/* Year Dialog */}
      <Dialog 
        open={yearDialogOpen} 
        onClose={() => setYearDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#2a5298', color: 'white' }}>
          {editingYear ? 'Edit Academic Year' : 'Add New Academic Year'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, width: 400, maxWidth: '100%' }}>
          {selectedProgram && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(42, 82, 152, 0.1)', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Program: <Typography component="span" fontWeight="bold">{selectedProgram.programName}</Typography>
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Starting Year"
            type="number"
            value={yearFormData.startYear}
            onChange={(e) => setYearFormData({ ...yearFormData, startYear: e.target.value })}
            margin="normal"
            required
            helperText={`Will be displayed as ${yearFormData.startYear}-${parseInt(yearFormData.startYear) + 4}`}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Year Number</InputLabel>
            <Select
              value={yearFormData.yearNumber}
              onChange={(e) => setYearFormData({ ...yearFormData, yearNumber: e.target.value })}
              label="Year Number"
            >
              <MenuItem value="First">First Year</MenuItem>
              <MenuItem value="Second">Second Year</MenuItem>
              <MenuItem value="Third">Third Year</MenuItem>
              <MenuItem value="Fourth">Fourth Year</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setYearDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleYearSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            {editingYear ? 'Update' : 'Add'} Year
          </Button>
        </DialogActions>
      </Dialog>

      {/* Branch Dialog */}
      <Dialog 
        open={branchDialogOpen} 
        onClose={() => setBranchDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#3a6db5', color: 'white' }}>
          {editingBranch ? 'Edit Branch' : 'Add New Branch'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, width: 400, maxWidth: '100%' }}>
          {selectedYear && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(58, 109, 181, 0.1)', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Year: <Typography component="span" fontWeight="bold">{selectedYear.yearName} ({selectedYear.yearNumber} Year)</Typography>
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Branch Name"
            value={branchFormData.branchName}
            onChange={(e) => setBranchFormData({ ...branchFormData, branchName: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., Computer Science, Mechanical, Civil"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBranchDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBranchSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            {editingBranch ? 'Update' : 'Add'} Branch
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section Dialog */}
      <Dialog 
        open={sectionDialogOpen} 
        onClose={() => setSectionDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#5282c7', color: 'white' }}>
          {editingSection ? 'Edit Section' : 'Add New Section'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, width: 400, maxWidth: '100%' }}>
          {selectedBranch && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(82, 130, 199, 0.1)', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Branch: <Typography component="span" fontWeight="bold">{selectedBranch.branchName}</Typography>
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Section Name"
            value={sectionFormData.sectionName}
            onChange={(e) => setSectionFormData({ ...sectionFormData, sectionName: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., A, B, C"
            helperText={`Will be displayed as "${selectedBranch?.branchName || 'Branch'} - ${sectionFormData.sectionName || '[Section]'}"`}
          />
          <TextField
            fullWidth
            label="Capacity"
            type="number"
            value={sectionFormData.capacity}
            onChange={(e) => setSectionFormData({ 
              ...sectionFormData, 
              capacity: parseInt(e.target.value, 10) || 0 
            })}
            margin="normal"
            required
            InputProps={{ inputProps: { min: 1, max: 200 } }}
            helperText="Maximum number of students in this section"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSectionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSectionSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            {editingSection ? 'Update' : 'Add'} Section
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose}
          severity={snackbarData.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Student;