import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { Edit, Delete } from '@mui/icons-material'
import urls from '../../urls/urls'
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme
} from '@mui/material'
import {
  getUserIdFromLocalStorage,
  getUserRoleFromLocalStorage
} from '../../data/localStorage'

const ManageUsers = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const [users, setUsers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const userRole = getUserRoleFromLocalStorage()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = getUserIdFromLocalStorage()
        const response = await axios.get(urls.fetchUser)
        const data = response.data

        const transformedUsers = data
          .filter(user =>
            userRole === 'superadmin'
              ? user.role === 'user'
              : user.role === 'user' &&
                String(user.created_by_id) === String(userId)
          )
          .map(user => ({
            id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            contact: user.contact,
            address: user.adress,
            zip_code: user.zip_code,
            role: user.role,
            image: user.image,
            createdBy: user.created_by_id || null
          }))

        setUsers(transformedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
    const intervalId = setInterval(fetchUsers, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const handleIconClick = () => {
    navigate('/Dashboard/create_user')
  }

  const handleOpenDialog = userId => {
    setUserToDelete(userId)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setUserToDelete(null)
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.post(`${urls.deleteUser(userToDelete)}`)
      setUsers(prev => prev.filter(user => String(user.id) !== String(userToDelete)))
      setOpenDialog(false)
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error)
      alert(`Failed to delete user: ${error.response?.data?.message || 'Server Error'}`)
    }
  }

  const handleEditUser = async user => {
    if (!user?.id) return

    try {
      const response = await axios.get(`${urls.userGateways}?user_id=${user.id}`)
      const userGateways = response.data.Gateways
      const userData = { user, userGateways }
      navigate('/dashboard/create_user', { state: { userData } })
    } catch (error) {
      console.error('Error fetching Gateways:', error.response?.data || error.message)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchSearch =
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterType === 'assigned') return matchSearch && user.createdBy
    if (filterType === 'unassigned') return matchSearch && !user.createdBy
    return matchSearch
  })

  return (
    <div className="w-full">
      <div
        className="flex justify-between items-center border-b py-3 px-4"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-gray-600">Managing the Users</p>
        </div>

        {userRole !== 'superadmin' && (
          <div className="flex-1 text-right">
            <button
              style={{ background: theme.palette.background.create }}
              onClick={handleIconClick}
              className="flex items-center gap-2 text-blue-600 cursor-pointer"
            >
              <Plus
                size={40}
                className="hover:scale-110 transition-transform"
                style={{ color: theme.palette.text.TextColor }}
              />
              <p style={{ color: theme.palette.text.TextColor }}>Create User</p>
            </button>
          </div>
        )}
      </div>

      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            background: 'linear-gradient(135deg, rgb(103, 182, 247), rgb(50, 120, 185))',
            padding: '10px',
            borderRadius: '8px'
          }}
        >
          <Typography variant="h5">User Data Table</Typography>

          <Box display="flex" gap={2} alignItems="center">
            {userRole === 'superadmin' && (
              <>
                <Button
                  variant={filterType === 'assigned' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('assigned')}
                >
                  Assigned
                </Button>
                <Button
                  variant={filterType === 'unassigned' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('unassigned')}
                >
                  Unassigned
                </Button>
                <Button
                  variant={filterType === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
              </>
            )}

            <TextField
              variant="outlined"
              placeholder="Search"
              size="small"
              sx={{ width: '250px', background: theme.palette.background.paper }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: theme.palette.background.paper }}>
                <TableCell>Sr No</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Access Level</TableCell>
                {userRole === 'superadmin' && <TableCell>Status</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.contact}</TableCell>
                    <TableCell>{user.role === 'admin' ? 'Admin' : 'User'}</TableCell>
                    {userRole === 'superadmin' && (
                      <TableCell>
                        <span
                          style={{
                            backgroundColor: user.createdBy ? '#4CAF50' : '#F44336',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 500
                          }}
                        >
                          {user.createdBy ? 'Assigned' : 'Unassigned'}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton color="primary" onClick={() => handleEditUser(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDialog(user.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ManageUsers
