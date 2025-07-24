import React, { useEffect, useState } from 'react'
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  TextField,
  Typography,
  useTheme,
  Button,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useNavigate } from 'react-router-dom'
import WidgetsDropdown from './../widgets/WidgetsDropdown'
import axios from 'axios'
import urls from '../../urls/urls'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const theme = useTheme()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [userAlotedGatewaysCount, setUserAlotedGatewaysCount] = useState(0)
  const [deployedHardwareCount, setDeployedHardwareCount] = useState(0)
  const [hardwareCount, setHardwareCount] = useState(0)
  const [totalUser, setTotalUsers] = useState([])
  const [totalAdmins, setTotalAdmins] = useState([])
  const [adminDetails, setAdminDetails] = useState([])
  const [superAdminTotalProjectCount, setSuperAdminTotalProjectCount] = useState(0)
  const [allUsers, setAllUsers] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [enrichedAdminDetails, setEnrichedAdminDetails] = useState([])
  const [selectedAdmin, setSelectedAdmin] = useState(null)

  useEffect(() => {
    const getSuperAdminTotalProject = async () => {
      try {
        const response = await axios.get(urls.Get_superAdmin_Project_Count)
        setSuperAdminTotalProjectCount(response.data.total_projects)
      } catch (error) {
        console.error('Error fetching super admin projects:', error)
      }
    }
    getSuperAdminTotalProject()
    const intervalId = setInterval(getSuperAdminTotalProject, 5000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(urls.adminDetails)
        if (response.data) {
          setAdminDetails(response.data)
        }
      } catch (error) {
        console.error('Error fetching admin details:', error)
      }
    }
    fetchAdminDetails()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          axios.get(urls.fetchUser),
          axios.get(urls.getToalProject),
        ])
        setAllUsers(usersRes.data?.users || [])
        setAllProjects(projectsRes.data?.projects || [])
      } catch (error) {
        console.error('Error fetching users/projects:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (adminDetails.length) {
      const enriched = adminDetails.map((admin) => {
        const totalUsers = allUsers.filter(user => String(user.created_by_id) === String(admin.id)).length
        const totalProjects = allProjects.filter(project => String(project.created_by_id) === String(admin.id)).length
        return { ...admin, totalUsers, totalProjects }
      })
      setEnrichedAdminDetails(enriched)
    }
  }, [adminDetails, allUsers, allProjects])

  useEffect(() => {
    const fetchTotalAdmins = async () => {
      try {
        const res = await fetch(urls.adminCount)
        const data = await res.json()
        setTotalAdmins(data.admin_users)
      } catch (error) {
        console.error('Error fetching total admins:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTotalAdmins()
    const intervalId = setInterval(fetchTotalAdmins, 5000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch(urls.userCount)
        const data = await res.json()
        setTotalUsers(data.total_users)
      } catch (error) {
        console.error('Error fetching total users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTotalUsers()
    const intervalId = setInterval(fetchTotalUsers, 5000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchDeployed = async () => {
      try {
        const res = await fetch(urls.deployedGatewaysCount)
        const data = await res.json()
        setDeployedHardwareCount(data.deployed_gateways_count)
      } catch (error) {
        console.error('Error fetching deployed count:', error)
      }
    }
    fetchDeployed()
    const intervalId = setInterval(fetchDeployed, 5000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchAloted = async () => {
      try {
        const res = await axios.get(urls.userAlotedGatewaysCount)
        setUserAlotedGatewaysCount(res.data.user_aloted_count)
      } catch (error) {
        console.error('Error fetching aloted count:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAloted()
    const intervalId = setInterval(fetchAloted, 5000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchTotalHardware = async () => {
      try {
        const res = await fetch(urls.totalGatewaysCount)
        const data = await res.json()
        setHardwareCount(data.gateways_count)
      } catch (error) {
        console.error('Error fetching total hardware:', error)
      }
    }
    fetchTotalHardware()
    const intervalId = setInterval(fetchTotalHardware, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const filteredProjects = selectedAdmin
    ? allProjects.filter(p => String(p.created_by_id) === String(selectedAdmin.id))
    : []

  const handleProjectClick = (project) => {
    navigate('/dashboard/project_data', {
      state: {
        projectName: project.name,
        projectId: project.PM_id,
        longitude: project.longitude,
        latitude: project.latitude,
        address: project.address,
        connected_gateways: project.connected_gateways || [],
      },
    })
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <WidgetsDropdown title={loading ? 'Loading...' : totalAdmins} subtitle="Total Admin" icon={<PeopleIcon />} bgColor="linear-gradient(135deg,#000,#1a1a1a,#333)" />
        <WidgetsDropdown title={loading ? 'Loading...' : totalUser} subtitle="Total Users" icon={<PeopleIcon />} bgColor="linear-gradient(135deg,rgb(103, 182, 247),rgb(50, 120, 185))" />
        <WidgetsDropdown title={loading ? 'Loading...' : userAlotedGatewaysCount} subtitle="Aloted Hardware" icon={<CheckCircleIcon />} bgColor="linear-gradient(135deg,rgb(248, 205, 141), #fb8c00)" />
        <WidgetsDropdown title={loading ? 'Loading...' : deployedHardwareCount} subtitle="Deployed Hardware" icon={<CloudUploadIcon />} bgColor="linear-gradient(135deg,rgb(187, 155, 243), #5e35b1)" />
        <WidgetsDropdown title={loading ? 'Loading...' : hardwareCount} subtitle="Total Hardware" icon={<DevicesIcon />} bgColor="linear-gradient(135deg,rgb(131, 219, 136), #43a047)" />
        <WidgetsDropdown title={superAdminTotalProjectCount} subtitle="Total Projects" icon={<AssignmentIcon />} bgColor="linear-gradient(135deg,rgb(250, 150, 148), #e53935)" />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, background: 'linear-gradient(135deg,rgb(103, 182, 247),rgb(50, 120, 185))', p: 2, borderRadius: '8px' }}>
          <Typography variant="h5">{selectedAdmin ? `Project Details for ${selectedAdmin.username}` : 'Admin Details'}</Typography>
          {!selectedAdmin && (
            <TextField
              variant="outlined"
              placeholder="Search"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250, background: theme.palette.background.paper }}
            />
          )}
        </Box>

        {!selectedAdmin && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr No.</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Total Users</TableCell>
                  <TableCell>Total Projects</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrichedAdminDetails
                  .filter((admin) => admin.username?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((admin, index) => (
                    <TableRow key={admin.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedAdmin(admin)}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.totalUsers}</TableCell>
                      <TableCell>{admin.totalProjects}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selectedAdmin && (
          <Box mt={4}>
            <Button variant="outlined" onClick={() => setSelectedAdmin(null)} sx={{ mb: 2 }}>← Back to Admin List</Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No</TableCell>
                    <TableCell>Project ID</TableCell>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProjects.map((project, index) => (
                    <TableRow
                      key={project.PM_id || index}
                      hover
                      onClick={() => handleProjectClick(project)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                          backgroundColor: theme.palette.background.paper,
                        },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{project.PM_id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar src={project.user_image} alt={project.user_firstname} sx={{ width: 32, height: 32 }}>
                            {project.user_firstname?.[0] || 'U'}
                          </Avatar>
                          <Typography variant="body2">{project.user_firstname}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{project.address}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          disableElevation
                          disableRipple
                          sx={{
                            p: 0,
                            px: 1,
                            bgcolor: project.is_active ? '#4EA44D' : 'red',
                            color: 'white',
                            fontSize: '12px',
                            pointerEvents: 'none',
                            cursor: 'default',
                            '&:hover': {
                              bgcolor: project.is_active ? '#4EA44D' : 'red',
                            },
                          }}
                        >
                          {project.is_active ? 'Active' : 'Inactive'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Dashboard
