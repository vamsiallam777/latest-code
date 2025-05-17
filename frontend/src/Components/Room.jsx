import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const buttonStyle = {
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  }
};

const cardStyle = {
  minHeight: '120px',
  width: '100%',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': { 
    transform: 'translateY(-4px)', 
    boxShadow: 3 
  }
};

const gridStyle = {
  height: '100%',
  minHeight: '400px'
};

const getFloorText = (floorNumber) => {
  const suffixes = {
    1: 'st',
    2: 'nd',
    3: 'rd'
  };
  const suffix = suffixes[floorNumber] || 'th';
  return `${floorNumber}${suffix} Floor`;
};

const formatRoomNumber = (roomNumber) => {
  if (!roomNumber || !roomNumber.includes('-')) return roomNumber;
  
  const [block, number] = roomNumber.split('-');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ fontSize: '0.9em' }}>{block}</span>
      &nbsp;
      <span>{number}</span>
    </span>
  );
};

const getRoomTypeDisplay = (roomType) => {
  switch (roomType) {
    case 'ROOM_8X8':
      return '8 × 8 Room';
    case 'ROOM_8X12':
      return '8 × 12 Room';
    default:
      return roomType;
  }
};

function Room() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: '',
    severity: 'success'
  });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [floors, setFloors] = useState([]);
  const [floorDialogOpen, setFloorDialogOpen] = useState(false);
  const [floorFormData, setFloorFormData] = useState({
    floorNumber: ''
  });
  const [rooms, setRooms] = useState([]);  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomType: 'ROOM_8X8'
  });
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

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
    fetchBlocks();
  }, [navigate, token]);

  const fetchBlocks = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/blocks', {
        headers: headers
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
      setSnackbarData({
        message: 'Error fetching blocks',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };

  const fetchFloors = async (blockId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/floors/block/${blockId}`, {
        headers: headers
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      const data = await response.json();
      setFloors(data);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const fetchRooms = async (floorId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/rooms/floor/${floorId}`, {
        headers: headers
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleOpen = (block = null) => {
    if (block) {
      setEditingBlock(block);
      setFormData(block);
    } else {
      setEditingBlock(null);
      setFormData({ name: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBlock(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        name: formData.name && !formData.name.toLowerCase().includes('block') ? 
          `${formData.name}-Block` : formData.name
      };

      const url = editingBlock
        ? `http://localhost:8081/api/blocks/${editingBlock.id}`
        : 'http://localhost:8081/api/blocks';
      
      const method = editingBlock ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: headers,
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (response.ok) {
        fetchBlocks();
        handleClose();
        setSnackbarData({
          message: `Block successfully ${editingBlock ? 'updated' : 'created'}!`,
          severity: 'success'
        });
      } else {
        setSnackbarData({
          message: data.error || 'Failed to save block',
          severity: 'error'
        });
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving block:', error);
      setSnackbarData({
        message: 'Error saving block',
        severity: 'error'
      });
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/blocks/${id}`, {
          method: 'DELETE',
          headers: headers
        });
        if (response.ok) {
          fetchBlocks();
        }
      } catch (error) {
        console.error('Error deleting block:', error);
      }
    }
  };

  const handleBlockClick = async (block, event) => {
    if (event.target.closest('button')) {
      return;
    }
    setSelectedBlock(block);
    await fetchFloors(block.id);
  };

  const handleAddFloor = () => {
    setFloorDialogOpen(true);
  };

  const handleFloorSubmit = async (e) => {
    e.preventDefault();
    
    if (!floorFormData.floorNumber) {
      setSnackbarData({
        message: 'Please enter a floor number',
        severity: 'error'
      });
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8081/api/floors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          floorNumber: floorFormData.floorNumber,
          blockId: selectedBlock.id
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        await fetchFloors(selectedBlock.id);
        setFloorDialogOpen(false);
        setFloorFormData({ floorNumber: '' });
        setSnackbarData({
          message: 'Floor added successfully!',
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbarData({
          message: errorData.error || 'Failed to add floor',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error adding floor:', error);
      setSnackbarData({
        message: 'Error adding floor',
        severity: 'error'
      });
    }
    setSnackbarOpen(true);
  };

  const handleDeleteFloor = async (floorId) => {
    if (window.confirm('Are you sure you want to delete this floor?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/floors/${floorId}`, {
          method: 'DELETE',
          headers: headers
        });
        if (response.ok) {
          fetchFloors(selectedBlock.id);
        }
      } catch (error) {
        console.error('Error deleting floor:', error);
      }
    }
  };

  const handleFloorClick = async (floor, event) => {
    if (event.target.closest('button')) {
      return;
    }
    setSelectedFloor(floor);
    await fetchRooms(floor.id);
  };

  const handleAddRoom = () => {
    setRoomDialogOpen(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity
    });
    setRoomDialogOpen(true);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      let formattedRoomNumber = roomFormData.roomNumber;
      const blockPrefix = selectedBlock.name.replace(/-Block$/i, '');
      if (!formattedRoomNumber.toLowerCase().startsWith(blockPrefix.toLowerCase())) {
        formattedRoomNumber = `${blockPrefix}-${formattedRoomNumber}`;
      }
      
      const url = editingRoom
        ? `http://localhost:8081/api/rooms/${editingRoom.id}`
        : 'http://localhost:8081/api/rooms';
      
      const method = editingRoom ? 'PUT' : 'POST';
      
      const requestData = {
        ...roomFormData,
        roomNumber: formattedRoomNumber,
        floorId: selectedFloor.id
      };

      const response = await fetch(url, {
        method,
        headers: headers,
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        fetchRooms(selectedFloor.id);
        setRoomDialogOpen(false);
        setRoomFormData({ roomNumber: '', roomType: 'ROOM_8X8', capacity: 64 });
        setEditingRoom(null);
        setSnackbarData({
          message: `Room ${editingRoom ? 'updated' : 'added'} successfully!`,
          severity: 'success'
        });
      } else {
        setSnackbarData({
          message: 'Failed to save room',
          severity: 'error'
        });
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/rooms/${roomId}`, {
          method: 'DELETE',
          headers: headers
        });
        if (response.ok) {
          fetchRooms(selectedFloor.id);
          setSnackbarData({
            message: 'Room deleted successfully!',
            severity: 'success'
          });
        } else {
          setSnackbarData({
            message: 'Failed to delete room',
            severity: 'error'
          });
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting room:', error);
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
        Manage Rooms
      </Typography>
      <Grid container spacing={3} sx={gridStyle}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%', minHeight: '400px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Blocks</Typography>
              <Button 
                variant="contained" 
                onClick={() => handleOpen()}
                sx={buttonStyle}
              >
                Add Block
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {blocks.map((block) => (
                <Grid item xs={12} key={block.id}>
                  <Card 
                    sx={{
                      ...cardStyle,
                      bgcolor: selectedBlock?.id === block.id ? 'primary.light' : 'background.paper',
                      color: selectedBlock?.id === block.id ? 'white' : 'inherit'
                    }}
                    onClick={(e) => handleBlockClick(block, e)}
                  >
                    <CardContent> 
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        minHeight: '48px'
                      }}>
                        <Typography variant="h6">{block.name}</Typography>
                        <Box>                          <IconButton 
                            size="small" 
                            onClick={() => handleOpen(block)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(block.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%', minHeight: '400px' }}>
            {selectedBlock ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Floors in {selectedBlock.name}</Typography>
                  <Button 
                    variant="contained" 
                    onClick={handleAddFloor}
                    sx={buttonStyle}
                  >
                    Add Floor
                  </Button>
                </Box>
                
                {floors.length > 0 ? (
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      border: 'none', 
                      boxShadow: 'none',
                      width: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    <Table size="small" sx={{ minWidth: 'auto' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell width="70%">Floor</TableCell>
                          <TableCell width="30%" align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {floors.map((floor) => (
                          <TableRow 
                            key={floor.id}
                            onClick={(e) => handleFloorClick(floor, e)}
                            sx={{ 
                              cursor: 'pointer',
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': { 
                                bgcolor: selectedFloor?.id === floor.id 
                                  ? 'primary.light'  
                                  : 'rgba(0, 0, 0, 0.04)' 
                              },
                              bgcolor: selectedFloor?.id === floor.id ? 'primary.light' : 'inherit',
                              color: selectedFloor?.id === floor.id ? 'white' : 'inherit'
                            }}
                          >
                            <TableCell
                              sx={{ 
                                color: 'inherit',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {getFloorText(floor.floorNumber)}
                            </TableCell>
                            <TableCell align="right">                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFloor(floor.id);
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
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 'calc(100% - 60px)',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>No Floors Available</Typography>
                    <Typography>Click 'Add Floor' to create a new floor</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' 
              }}>
                <Typography color="text.secondary">Select a block to view floors</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%', minHeight: '400px' }}>
            {selectedFloor ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">
                    {selectedBlock.name} - {getFloorText(selectedFloor.floorNumber)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={handleAddRoom}
                    sx={buttonStyle}
                  >
                    Add Room
                  </Button>
                </Box>
                
                {rooms.length > 0 ? (
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      border: 'none', 
                      boxShadow: 'none',
                      width: '100%'
                    }}
                  >
                    <Table size="small" sx={{ minWidth: 'auto' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell width="25%">Room</TableCell>
                          <TableCell width="25%">Type</TableCell>
                          <TableCell width="25%">Capacity</TableCell>
                          <TableCell width="25%" align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rooms.map((room) => (
                          <TableRow 
                            key={room.id}
                            sx={{ 
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                            }}
                          >
                            <TableCell sx={{ 
                              maxWidth: '25%', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {formatRoomNumber(room.roomNumber)}
                            </TableCell>
                            <TableCell sx={{ maxWidth: '25%' }}>
                              {getRoomTypeDisplay(room.roomType)}
                            </TableCell>
                            <TableCell sx={{ maxWidth: '25%' }}>{room.capacity}</TableCell>
                            <TableCell 
                              align="right" 
                              sx={{ 
                                maxWidth: '25%',
                                pr: 1,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end',
                                gap: 1
                              }}>                              <IconButton size="small" onClick={() => handleEditRoom(room)} color="primary">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteRoom(room.id)} color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 'calc(100% - 60px)',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>No Rooms Available</Typography>
                    <Typography>Click 'Add Room' to create a new room</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' 
              }}>
                <Typography color="text.secondary">
                  Select a floor to view rooms
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingBlock ? 'Edit Block' : 'Add New Block'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Block Name (e.g. W)"
              helperText="Just enter the block name like 'W'. We'll format it as 'W-Block' for you."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            {editingBlock ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={floorDialogOpen} onClose={() => setFloorDialogOpen(false)}>
        <DialogTitle>Add New Floor</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Floor Number"
              type="number"
              value={floorFormData.floorNumber}
              onChange={(e) => setFloorFormData({ floorNumber: parseInt(e.target.value, 10) })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFloorDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleFloorSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            Add Floor
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={roomDialogOpen} 
        onClose={() => {
          setRoomDialogOpen(false);
          setEditingRoom(null);
          setRoomFormData({ roomNumber: '', roomType: 'ROOM_8X8', capacity: 64 });
        }}
      >
        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Room Number"
            value={roomFormData.roomNumber}
            onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
            margin="normal"
            helperText={`Just enter the number (e.g. 201). Block prefix will be added automatically.`}
          />
          <TextField
            select
            fullWidth
            label="Room Type"
            value={roomFormData.roomType}
            onChange={(e) => {
              const type = e.target.value;
              const capacity = type === 'ROOM_8X8' ? 64 : 96;
              setRoomFormData({ 
                ...roomFormData, 
                roomType: type,
                capacity: capacity
              });
            }}
            margin="normal"
          >
            <MenuItem value="ROOM_8X8">8x8 (64 seats)</MenuItem>
            <MenuItem value="ROOM_8X12">8x12 (96 seats)</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRoomDialogOpen(false);
            setEditingRoom(null);
            setRoomFormData({ roomNumber: '', roomType: 'ROOM_8X8', capacity: 64 });
          }}>Cancel</Button>
          <Button 
            onClick={handleRoomSubmit} 
            variant="contained"
            sx={buttonStyle}
          >
            {editingRoom ? 'Update' : 'Add'} Room
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarOpen}
        autoHideDuration={2000}
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

export default Room;