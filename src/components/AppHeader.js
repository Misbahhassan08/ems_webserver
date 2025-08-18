import React, { useContext, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Typography, useTheme } from '@mui/material'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { DarkMode, LightMode, ExitToApp } from '@mui/icons-material'
import {
  cilBell,
  cilMenu,
} from '@coreui/icons'
import { motion } from 'framer-motion'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { ColorModeContext } from '../views/theme/ThemeContext'
import urls from '../urls/urls'
import dayjs from 'dayjs'
import { useLocation } from 'react-router-dom';

const AppHeader = () => {
  const theme = useTheme()
  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const colorMode = useContext(ColorModeContext)
  const isDarkMode = theme.palette.mode === 'dark'
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false)
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = React.useState(dayjs())

    const location = useLocation();
    const project_id = location.state?.projectId || ''
    const {
      projectName,
      projectId,
      longitude,
      latitude,
      address,
      connected_gateways = [],
    } = location.state || {};
  const username = location.state?.username || '';
  const role = location.state?.role || '';

  // ⏱ Update real-time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true)
  }

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false)
  }

  const handleLogout = async () => {
    localStorage.removeItem('selectedGateways')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedProjectId')
    localStorage.removeItem('selectedGatewayId')

    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.post(
        urls.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200) {
        localStorage.removeItem('authToken')
        navigate('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0"
      ref={headerRef}
      style={{ background: theme.palette.background.paper }}
    >
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" style={{ color: theme.palette.text.TextColor }} />
        </CHeaderToggler>

 {location.pathname === '/dashboard' && (
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink
              to="/dashboard"
              as={NavLink}
              style={{
                color: theme.palette.text.TextColor,
                fontSize: '0.8rem'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              <br />
              Welcome to your dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      )}

   {location.pathname === '/dashboard/SuperAdminDashboard' && (
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink
              to="/dashboard/SuperAdminDashboard"
              as={NavLink}
              style={{
                color: theme.palette.text.TextColor,
                fontSize: '0.8rem'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Dashboard</span>
              <br />
              Welcome to your dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      )}
 {location.pathname === '/dashboard/user_dashboard' && (
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink
              to="/dashboard/user_dashboard"
              as={NavLink}
              style={{
                color: theme.palette.text.TextColor,
                fontSize: '0.8rem'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>User ({username})</span>
              <br />
              Welcome to your dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      )}

{location.pathname === '/dashboard/project_data' && (
  <CHeaderNav className="d-none d-md-flex">
    <CNavItem>
      <CNavLink
        to="/dashboard/project_data"
        as={NavLink}
        style={{
          color: theme.palette.text.TextColor,
          fontSize: '0.8rem'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>
          Project ({projectName})
          {role === 'admin' && username ? ` | User (${username})` : ''}
        </span>
        <br />
        Welcome to your dashboard
      </CNavLink>
    </CNavItem>
  </CHeaderNav>
)}


      {location.pathname === '/dashboard/project_manager' && (
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink
              to="/dashboard/project_manager"
              as={NavLink}
              style={{
                color: theme.palette.text.TextColor,
                fontSize: '0.8rem'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Gateway</span>
              <br />
              Welcome to your dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      )}
            

        <CHeaderNav className="ms-auto" style={{ display: 'flex', alignItems: 'center', }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
          <Typography variant="body2" color="text.primary">
            
            {`Date: ${currentTime.format('YYYY-MM-DD')}`}
          </Typography>
          <Typography variant="body2" color="text.primary">
            
            {`Time: ${currentTime.format('HH:mm:ss')}`}
          </Typography>
        </div>

  <div className="vr h-100 mx-2 text-body text-opacity-75" />

  <IconButton onClick={colorMode.toggleColorMode}>
    {isDarkMode ? (
      <LightMode sx={{ color: theme.palette.text.primary }} />
    ) : (
      <DarkMode sx={{ color: theme.palette.text.TextColor }} />
    )}
  </IconButton>

  <div className="vr h-100 mx-2 text-body text-opacity-75" />

  <IconButton>
    <CIcon icon={cilBell} size="lg" style={{ color: theme.palette.text.TextColor }} />
  </IconButton>

  <div className="vr h-100 mx-2 text-body text-opacity-75" />

  <IconButton onClick={handleOpenLogoutDialog}>
    <ExitToApp sx={{ color: theme.palette.text.TextColor, fontSize: 28 }} />
  </IconButton>
</CHeaderNav>


      </CContainer>

      {/* Logout Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        PaperComponent={(props) => (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          >
            <div
              {...props}
              style={{
                borderRadius: '12px',
                padding: '10px',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
                background: theme.palette.background.default,
              }}
            >
              {props.children}
            </div>
          </motion.div>
        )}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Logout</DialogTitle>
        <DialogContent
          sx={{ textAlign: 'center', fontSize: '16px', color: theme.palette.text.TextColor }}
        >
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: '15px' }}
        >
          <Button
            onClick={handleCloseLogoutDialog}
            sx={{
              backgroundColor: '#bbb',
              color: '#fff',
              '&:hover': { backgroundColor: '#999' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </CHeader>
  )
}

export default AppHeader
