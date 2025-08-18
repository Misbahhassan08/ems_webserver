import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  useTheme,
  Button,
} from '@mui/material'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import WidgetsDropdownuser from '../widgets/WidgetsDropdownuser'
import urls from '../../urls/urls'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddProject from './AddProject'
import { getUserIdFromLocalStorage } from '../../data/localStorage'
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userDeployedHardwareCount, setUserDeployedHardwareCount] = useState(0)
  const [userAlotedGatewaysCount, setUserAlotedGatewaysCount] = useState(0) // not fetched in this version
  const [userProjectsCount, setUserProjectsCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [userProjects, setUserProjects] = useState([])
  const [totalUserGateways, setTotalUserGateways] = useState([])
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const location = useLocation();
  const userIdFromLocation = location.state?.userId || null;
  const username = location.state?.username || '';
  const theme = useTheme()

  // ✅ fetch user projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        
        const response = await axios.get(
        `${urls.getProjects}${userIdFromLocation}/`  // ✅ Correct call
      )
        setUserProjects(Array.isArray(response.data.project_managers) ? response.data.project_managers : [])
        setLastUpdateTime(new Date())
      } catch (error) {
        console.error('Error Fetching Projects', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
    const intervalId = setInterval(fetchProjects, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // ✅ fetch total user projects count
useEffect(() => {
  const fetchTotalUserProjectsCount = async () => {
    try {
      const response = await axios.get(
        `${urls.usertotalProjects}${userIdFromLocation}/`
      )

      // axios returns data directly
      setUserProjectsCount(response.data.project_count)
    } catch (error) {
      console.error('Error fetching Total Projects count:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchTotalUserProjectsCount()

  const intervalId = setInterval(fetchTotalUserProjectsCount, 5000)
  return () => clearInterval(intervalId)
}, [])


  // ✅ fetch total user gateways
  useEffect(() => {
    const getTotalUsergateways = async () => {
      try {
        const response = await axios.get(
          `${urls.fetchTotalUserGateways}?user_id=${userIdFromLocation}`
        )
        setTotalUserGateways(response.data.gateways_count)
      } catch (error) {
        console.error('Error fetching user gateways:', error)
      }
    }

    getTotalUsergateways()
    const intervalId = setInterval(getTotalUsergateways, 5000)
    return () => clearInterval(intervalId)
  }, [])

// ✅ fetch deployed gateways
useEffect(() => {
  const fetchUserDeployedGatewayCount = async () => {
    try {
      const response = await axios.get(
        `${urls.get_deployed_gateway_counting}${userIdFromLocation}/`
      )

      // axios returns response.data directly
      setUserDeployedHardwareCount(response.data.deployed_gateway_count)
    } catch (error) {
      console.error('Error fetching Deployed Gateway count:', error)
    }
  }

  fetchUserDeployedGatewayCount()
  const intervalId = setInterval(fetchUserDeployedGatewayCount, 5000)
  return () => clearInterval(intervalId)
}, [userIdFromLocation])

  const filteredUserProjects = userProjects
    .filter(
      (project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.PM_id?.toString().includes(searchTerm) ||
        project.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const search = searchTerm.toLowerCase()
      const aStarts = a.name?.toLowerCase().startsWith(search)
      const bStarts = b.name?.toLowerCase().startsWith(search)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return 0
    })

  const handleProjectClick = (project) => {

    navigate('/dashboard/project_data', {
      
      state: {
        
        projectName: project.name,
        projectId: project.PM_id,
        longitude: project.longitude,
        latitude: project.latitude,
        address: project.address,
        connected_gateways: project.connected_gateways || [],
        username: username,
        //role: role,
      },
    })
  }

  return (
    <Box>
      {/* Last update info */}
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="1rem">
        {lastUpdateTime && (
          <Typography variant="body2" color="text.primary">
            {`Last Update: ${new Date(lastUpdateTime).toLocaleString()}`}
          </Typography>
        )}
      </Box>

      {/* Dashboard cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <WidgetsDropdownuser
          title={loading ? 'Loading...' : totalUserGateways}
          subtitle="Total Hardware"
          icon={<DevicesIcon />}
          bgColor="#7978E9"
        />
        <WidgetsDropdownuser
          title={loading ? 'Loading...' : userAlotedGatewaysCount}
          subtitle="Aloted Hardware"
          icon={<CheckCircleIcon />}
          bgColor="#2FC87B"
        />
        <WidgetsDropdownuser
          title={loading ? 'Loading...' : userDeployedHardwareCount}
          subtitle="Deployed Hardware"
          icon={<CloudUploadIcon />}
          bgColor="#F3797E"
        />
        <WidgetsDropdownuser
          title={loading ? 'Loading...' : userProjectsCount}
          subtitle="Total Projects"
          icon={<AssignmentIcon />}
          bgColor="#0DCAF0"
        />
      </Box>

      {/* Projects Table */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            background:
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgb(103, 182, 247), rgb(50, 120, 185))'
                : '#2B344A',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5">User Projects</Typography>
          <TextField
            variant="outlined"
            placeholder="Search Project"
            size="small"
            sx={{
              width: '250px',
              background: theme.palette.background.paper,
              borderRadius: '4px',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddProject />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Project ID</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Connected Gateways</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUserProjects.map((project, index) => (
                <TableRow
                  hover
                  key={project.PM_id || index}
                  onClick={() => handleProjectClick(project)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{project.PM_id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.address}</TableCell>
                  <TableCell>{project.connected_gateways?.length ?? 0}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      disableRipple
                      sx={{
                        px: 1,
                        bgcolor: project.is_active ? '#4EA44D' : 'red',
                        color: 'white',
                        fontSize: '12px',
                        boxShadow: 'none',
                        pointerEvents: 'none',
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
    </Box>
  )
}

export default Dashboard
