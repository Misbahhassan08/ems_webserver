import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CSidebar,
  CSidebarFooter,
  CNavTitle,
  CNavGroup,
  CNavItem
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import urls from '../urls/urls'
import { cilHouse, cilIndustry } from '@coreui/icons'
import { getUserFromLocalStorage, getUserIdFromLocalStorage } from '../data/localStorage'
import _nav from '../_nav'

// Capitalize helper
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const location = useLocation()
  const navigate = useNavigate()

  // Local state
  const [user, setUser] = useState({ name: '', avatar: '' })
  const [role, setRole] = useState('')
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([]) // 🔹 store users for admin/superadmin
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const username = location.state?.username || '';
  // ================= PROJECT HANDLERS =================
  const handleProjectClick = (project) => {
    setSelectedProject(project.name)
    localStorage.setItem('selectedProjectId', project.PM_id)

    navigate('/dashboard/project_data', {
      state: {
        projectName: project.name,
        projectId: project.PM_id,
        longitude: project.longitude,
        latitude: project.latitude,
        address: project.address,
        connected_gateways: project.connected_gateways || []
      }
    })
  }

  const handleGatewayClick = (e, gateway, project) => {
    e.stopPropagation()
    if (!gateway || !project) return

    localStorage.setItem('selectedGatewayId', gateway.gateway_id)
    localStorage.setItem('selectedProjectId', project.PM_id)

    navigate('/dashboard/project_manager', { state: { gateway } })
  }

  const generateProjectNavItems = () => {
    return projects.map((project) => ({
      component: CNavGroup,
      name: (
        <span style={{ userSelect: 'none' }}>
          {capitalize(project.name)}
        </span>
      ),
      onClick: () => handleProjectClick(project),
      items: (project.connected_gateways || []).map((gateway) => ({
        component: CNavItem,
        name: (
          <span
            onClick={(e) => {
              e.stopPropagation()
              handleGatewayClick(e, gateway, project)
            }}
            className={`custom-nav-item ${gateway.isSelected ? 'selected' : ''}`}
            style={{
              paddingLeft: 50,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <CIcon icon={cilHouse} customClassName="nav-icon" style={{ marginRight: 10 }} />
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <span>{capitalize(gateway.gateway_name)}</span>
              <span style={{ color: gateway.deploy_status ? 'green' : 'red' }}>●</span>
            </span>
          </span>
        )
      })),
      icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />
    }))
  }

  // ================= USER HANDLERS =================
  const handleUserClick = (usr) => {
    navigate(`/dashboard/user_dashboard`, {
      state: { userId: usr.id, username: `${usr.firstname} ${usr.lastname}`,}
    })
  }

  const generateUserNavItems = () => {
    return users.map((usr) => ({
      component: CNavItem,
      name: (
        <span
          onClick={() => handleUserClick(usr)}
          style={{
            paddingLeft: 40,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <CIcon icon={cilHouse} customClassName="nav-icon" style={{ marginRight: 10 }} />
          <span>{capitalize(usr.firstname)} {capitalize(usr.lastname)}</span>
        </span>
      )
    }))
  }

  // ================= HOOKS =================
  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProjectId')
    if (storedProjectId) setSelectedProject(storedProjectId)
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(urls.getUserProjects())
        setProjects(
          Array.isArray(response.data.project_managers) ? response.data.project_managers : []
        )
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

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      setUser({
        name: `${capitalize(userData.firstname)} ${capitalize(userData.lastname)}`,
        role: capitalize(userData.role),
        avatar: userData.image
      })
      setRole(userData.role || '')
    }
  }, [])

  // 🔹 fetch users if role is admin or superadmin
  useEffect(() => {
    if (!role) return

    const fetchUsers = async () => {
      try {
        const userId = getUserIdFromLocalStorage()
        const response = await axios.get(urls.fetchUser)
        const data = response.data

        const transformedUsers = data
          .filter(usr =>
            role.toLowerCase() === 'superadmin'
              ? usr.role === 'user'
              : usr.role === 'user' && String(usr.created_by_id) === String(userId)
          )
          .map(usr => ({
            id: usr.user_id,
            firstname: usr.firstname,
            lastname: usr.lastname,
            email: usr.email,
            contact: usr.contact,
            address: usr.adress,
            zip_code: usr.zip_code,
            role: usr.role,
            image: usr.image,
            createdBy: usr.created_by_id || null
          }))

        setUsers(transformedUsers)
      } catch (err) {
        console.error('Error fetching users', err)
      }
    }

    fetchUsers()
    const intervalId = setInterval(fetchUsers, 5000)
    return () => clearInterval(intervalId)
  }, [role])

  // ================= NAVIGATION CONFIG =================
  const getFilteredNav = () => {
    const roleNavConfig = {
      superadmin: _nav.filter(item =>
        ['DashBoard', 'Dash-Board', 'Pages', 'Manage Admins', 'Manage Admin', 'Create Admin', 'Manage Gateway','Manage Users', 'Notification'].includes(item.name)
      ),
      admin: _nav.filter(item =>
        ['DashBoard', 'Dashboard', 'Pages', 'Manage Users', 'Create User', 'Manage Hardware'].includes(item.name)
      ),
      user: _nav.filter(item =>
        ['DashBoard', 'Dashboard', 'Pages', 'Manage Project', 'Reporting', 'User Details'].includes(item.name)
      )
    }

    let baseNav = roleNavConfig[role.toLowerCase()] || []

    // 🔹 For user role → insert projects
    if (role.toLowerCase() === 'user' && projects.length > 0) {
      const dashboardIndex = baseNav.findIndex(item => item.name === 'Dashboard')
      const projectNav = [
        { component: CNavTitle, name: 'Projects' },
        ...generateProjectNavItems()
      ]
      if (dashboardIndex !== -1) {
        baseNav = [
          ...baseNav.slice(0, dashboardIndex + 1),
          ...projectNav,
          ...baseNav.slice(dashboardIndex + 1)
        ]
      } else {
        baseNav = [...projectNav, ...baseNav]
      }
    }

    // 🔹 For admin/superadmin role → insert users
    if ((role.toLowerCase() === 'admin' ) && users.length > 0) {
      const dashboardIndex = baseNav.findIndex(item => item.name === 'Dashboard')
      const userNav = [
        { component: CNavTitle, name: 'Users' },
        ...generateUserNavItems()
      ]
      if (dashboardIndex !== -1) {
        baseNav = [
          ...baseNav.slice(0, dashboardIndex + 1),
          ...userNav,
          ...baseNav.slice(dashboardIndex + 1)
        ]
      } else {
        baseNav = [...userNav, ...baseNav]
      }
    }

    return baseNav
  }

  const filteredNav = getFilteredNav()

  // ================= RENDER =================
  return (
    <CSidebar
      className="custom-sidebar"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* Sidebar Header */}
      <div className="border-bottom flex-col" style={{ padding: '20px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://mexemai.com/bucket/ems/image/022.png"
            alt="Logo"
            style={{
              height: '120px',
              width: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
            className="sidebar-brand-full"
          />
          <div style={{ color: 'white' }}>
            <Typography variant="subtitle1">Welcome to Enervue</Typography>
          </div>
          <div style={{ color: 'white', marginBottom: '15px' }}>
            <Typography variant="subtitle1">Dashboard</Typography>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'white' }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            {user.name || 'Loading...'}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'white' }}>
            {user.role || 'Loading...'}
          </Typography>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex"></CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
