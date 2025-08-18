import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import urls from '../../urls/urls';
import { getUserIdFromLocalStorage } from '../../data/localStorage';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ProjectDataCard from '../widgets/project_data_card'
import ProjectValueCard from '../widgets/project_value_card'
import { AddRounded, CheckCircle, CloudUpload, Devices, DynamicFeed, Error } from '@mui/icons-material';
// import projecticon from '../../assets/images/projecticon.svg'
import { useNavigate } from 'react-router-dom';
import ProjectChart from './PMGraphs/ProjectChart';
import DeployGateway from './DeployGateway'
import { theme } from 'highcharts';
import dayjs from "dayjs";
import icon1 from '../../assets/images/icon1.svg'
import icon2 from '../../assets/images/icon2.svg'
import icon3 from '../../assets/images/icon3.svg'
import vector1 from '../../assets/images/vector1.svg'
import vector2 from '../../assets/images/vector2.svg'
import panel from '../../assets/images/panel.svg'
import solar from '../../assets/images/solar.svg'
import trans from '../../assets/images/trans.svg'
import abc from '../../assets/images/abc.svg'
import plane from '../../assets/images/plane.svg'
import { useTheme } from '@mui/material/styles';



const ProjectData = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const location = useLocation();
  const project_id = location.state?.projectId || ''
  const {
    projectName,
    projectId,
    longitude,
    latitude,
    address,
    connected_gateways = [],
    admin,
    user,
  } = location.state || {};


  const navigate = useNavigate();

  const totalGateways = connected_gateways.length;
  const deployedGateways = connected_gateways.filter(g => g.deploy_status === 'deployed').length;
  const activeGateways = connected_gateways.filter(g => g.status === true).length;
  const allotedGateways = connected_gateways.filter(g => g.alloted === 'alloted').length;

  const [userAlotedGatewaysCount, setUserAlotedGatewaysCount] = useState(0);
  const [role, setRole] = useState('');
  const [totalgrid, setTotalgrid] = useState('0');
  const [totalsolar, setTotalsolar] = useState('0');
  const [totalgenset, setTotalGenset] = useState('0');
  const [totalgridexport, setTotalgridexport] = useState('0');
  const [lastUpdateTime, setLastUpdateTime] = useState(null)

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role || ''); // Set role from localStorage
    }
  }, []);
  // Fetch user-aloted gateways count
  useEffect(() => {
    const fetchUserAlotedGateways = async () => {
      try {
        const response = await axios.get(urls.userAlotedGatewaysCount);
        setUserAlotedGatewaysCount(response.data.user_aloted_count || 0);
        setLastUpdateTime(dayjs())
      } catch (error) {
        console.error('Error in fetching user aloted gateways count', error);
      }
    };


    fetchUserAlotedGateways();
    const intervalId = setInterval(fetchUserAlotedGateways, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  //Solar
  useEffect(() => {
    const fetchsolarForGateways = async () => {
      try {
        const response = await axios.get(`${urls.totalSolar}?Project_id=${project_id}`);
        const solarValue = response.data["Total_Solar"] || 0;
        setTotalsolar(solarValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", project_id, ":", solarValue.toFixed(2));
      } catch (error) {

        setTotalsolar("0.00");
      }
    };

    fetchsolarForGateways(); // Initial call
    const interval = setInterval(fetchsolarForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [project_id]);

  //Grid
  useEffect(() => {
    const fetchgridForGateways = async () => {
      try {
        const response = await axios.get(`${urls.totalgrid}?Project_id=${project_id}`);
        const gridValue = response.data["Total_Grid"] || 0;
        setTotalgrid(gridValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", project_id, ":", gridValue.toFixed(2));
      } catch (error) {

        setTotalgrid("0.00");
      }
    };

    fetchgridForGateways(); // Initial call
    const interval = setInterval(fetchgridForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [project_id]);

  // Genset
  useEffect(() => {
    const fetchGensetForGateways = async () => {
      try {
        const response = await axios.get(`${urls.totalGenset}?Project_id=${project_id}`);
        const GensetValue = response.data["Total_Generator"] || 0;
        setTotalGenset(GensetValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", project_id, ":", GensetValue.toFixed(2));
      } catch (error) {

        setTotalGenset("0.00");
      }
    };

    fetchGensetForGateways(); // Initial call
    const interval = setInterval(fetchGensetForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [project_id]);

  // gridexport
  useEffect(() => {
    const fetchgridexportForGateways = async () => {
      try {
        const response = await axios.get(`${urls.gridexport}?Project_id=${project_id}`);
        const gridexportValue = response.data["Total_Grid"] || 0;
        setTotalgridexport(gridexportValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", project_id, ":", gridexportValue.toFixed(2));
      } catch (error) {

        setTotalgridexport("0.00");
      }
    };

    fetchgridexportForGateways(); // Initial call
    const interval = setInterval(fetchgridexportForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [project_id]);





  const handleProjectClick = (gateway) => {
    navigate('/dashboard/project_manager', {
      state: {
        gateway,         // full gateway object
        projectId,       // also passing projectId or any other needed data
        projectName,
        user,
        admin,
      }
    });
  };


  return (

    <Box p={2}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left Side: Project Name and Welcome Message */}
        <Box>
          
        </Box>

        {/* Right Side: Last Update */}
{lastUpdateTime && (
  <Box 
    display="flex" 
    justifyContent="space-between"   // left & right
    alignItems="center" 
    margin="0 1rem"
  >
    {/* Left Side */}
    {role === "superadmin" && (
      <Typography variant="body2" color="text.primary" marginRight={70} sx={{ fontWeight: "bold", fontSize: "1.8rem" }}>
        {admin} | {user} | {projectName}
      </Typography>
    )}

    {/* Right Side */}
    <Typography variant="body2" color="text.primary">
      {`Last Update: ${lastUpdateTime.format('YYYY-MM-DD HH:mm:ss')}`}
    </Typography>
  </Box>
)}


      </Box>



      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>

        <ProjectDataCard
          title={totalGateways}
          subtitle="Total Hardware"
          icon={<Devices />}
          bgColor=" #7978E9
" // Blue
        />
        <ProjectDataCard
          title={userAlotedGatewaysCount}
          subtitle="Alloted Hardware"
          icon={<CheckCircle />}
          bgColor=" #3A3AF3
" // Blue
        />

        <ProjectDataCard
          title={deployedGateways}
          subtitle="Deployed Hardware"
          icon={<CloudUpload />}
          bgColor=' #0E7979'
        />
        <ProjectDataCard
          title={activeGateways}
          subtitle="Active Hardware"
          icon={<DynamicFeed />}
          bgColor="#339A66" // Blue
        />
        <ProjectDataCard
          title={'0'}
          subtitle="Issues"
          icon={<Error />}
          bgColor="#E64545" // Blue
        />
      </Box>
      {/* <h1>Project Data</h1>
      <h2>Project Name: {projectName}</h2>
      <h2>Project ID: {projectId}</h2>
      <h2>Longitude: {longitude}</h2>
      <h2>Latitude: {latitude}</h2>
      <h2>Address: {address}</h2>

      <h2>Total connected gateways: {totalGateways}</h2>
      <h2>Number of deployed gateways: {deployedGateways}</h2>
      <h2>Number of alloted gateways: {userAlotedGatewaysCount}</h2>
      <h2>Number of active gateways: {activeGateways}</h2>
      <h2>Number of issues in gateways: 0</h2>

            <h1>Usage Data</h1>
                  <h2>Solar Production: 0</h2>
                  <h2>Load Consumed: 0</h2>
                  <h2>Grid In: 0</h2>
                  <h2>Grid Out: 0</h2> */}
      <Box mt={3}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,

            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h5"
          >Total Values</Typography>


        </Box>
        <Box sx={{
          background: "#E9E9E9", display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', py: 2, px: 3, borderRadius: "10px",
          ...theme.palette.mode === 'light' ? {
            backgroundColor: '#E9E9E9',

          }
            : {
              background: '#2B344A',

            }

        }}>


          <ProjectValueCard
            title={totalsolar || "0.00"}
            subtitle="Total Solar Generation"
            icon={
              <Box
              >
                {isLight ? (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <img src={solar} alt="Group Icon" />
                    <img src={panel} alt="Group Icon" />
                  </Box>

                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                    <img src={vector1} alt="Group Icon" />
                    <img src={icon1} alt="Group Icon" />
                  </Box>

                )}






              </Box>
            }



          />
          <ProjectValueCard
            title={totalgrid || "0.00"}
            subtitle="Total Grid Import"
            icon={
              isLight ? (
                <Box
                  display="flex" >
                  <img src={trans} alt="icon" />
                  <Box sx={{ position: 'relative', top: '-6px' }}>
                    {<img src={abc} alt="icon" />}
                  </Box>

                </Box>
              ) : (

                <Box
                  display="flex">
                  {<img src={icon2} alt="icon" />}
                  <Box sx={{ position: 'relative', top: '-6px' }}>



                    {<img src={vector2} alt="icon" />}
                  </Box>



                </Box>
              )
            }


          />
          <ProjectValueCard
            title={totalgridexport || "0.00"}
            subtitle="Total Grid Export"
            icon={
              isLight ? (
                <Box
                  display="flex" >
                  <img src={trans} alt="icon" />
                  <Box sx={{ position: 'relative', top: '-6px' }}>
                    {<img src={abc} alt="icon" />}
                  </Box>

                </Box>
              ) : (

                <Box
                  display="flex">
                  {<img src={icon2} alt="icon" />}
                  <Box sx={{ position: 'relative', top: '-6px' }}>

                    {<img src={vector2} alt="icon" />}
                  </Box>




                </Box>
              )
            }


          />

          <ProjectValueCard
            title={totalgenset || "0.00"}
            subtitle="Total Generator"

            icon={
              <Box>
                {isLight ? (
                  <Box>
                    {<img src={plane} alt="icon" />}

                  </Box>
                ) : (

                  <Box>
                    {<img src={icon3} alt="icon" />}
                  </Box>
                )}

              </Box>
            }



          />


        </Box>

      </Box>


      <Box mt={3}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            padding: '10px',
            borderRadius: '8px',
            ...(theme.palette.mode === 'dark'
              ? {
                backgroundColor: '#2B344A',
              }
              : {
                background: 'linear-gradient(90deg, #5EACED 0%, #4089CA 100%)',
              }),

          }}
        >

          <Box
            sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}  >
            <Typography variant="h5" >Gateways</Typography>

            <TextField
              placeholder="Search"
              size="small"
              sx={{

                borderRadius: '4px',
                bgcolor: 'white',
                ml: '5',
                backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#4F5871',





              }}

            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}

            />
          </Box>

          <Box sx={{
            display: 'flex', justifyContent: 'center', gap: 2,
            alignItems: 'center',
          }}>
            <Box sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#43A48C',
              borderRadius: "20px", mt: "15px", padding: "5px",
              mb: "8px",

            }}>
              <AddRounded />
            </Box>

            <Box >
              {role === 'user' && <DeployGateway />}
            </Box>
          </Box>

        </Box>

        <TableContainer component={Paper} sx={{ overflow: "visible" }}>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell >ID</TableCell>
                <TableCell >Name</TableCell>
                <TableCell >Total Energy</TableCell>
                <TableCell >Active Power</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connected_gateways.map((gateway, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleProjectClick(gateway)} // Note: if 'gateway' is not a project, adjust accordingly
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <TableCell>{gateway.G_id}</TableCell>
                  <TableCell>{gateway.gateway_name}</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              ))}

              {connected_gateways.length === 0 && (

                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No connected gateways available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </TableContainer>
        <Box  
        sx={{
          flexWrap: 'wrap', justifyContent: 'center', py: 2, px: 3, borderRadius: "10px", mt: 3,
          backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#2B344A'
        }}>
          <ProjectChart />
        </Box>

      </Box>
    </Box>
  );
};

export default ProjectData;

