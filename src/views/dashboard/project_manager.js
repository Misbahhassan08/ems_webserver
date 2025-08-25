import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Grid,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Divider,
  useMediaQuery,
} from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  WiRain,
  WiCloudy,
  WiWindy,
  WiSunset,
  WiDaySunny,
  WiSnow,
  WiDayCloudy,
  WiHumidity,
  WiStrongWind,
} from 'react-icons/wi'
import CustomNode from './customNodes'
import AnimatedSVGEdge from './animatedSVGEdge'
import {
  ReactFlow, useNodesState, useEdgesState, Background, Handle
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import urls from '../../urls/urls'
import GuageMeter from './GuageMeter'
import PieChart from './PieChart'
import DummyImage from '../../assets/images/genset.png'
import { left } from '@popperjs/core'
import { ColorModeContext } from '../theme/ThemeContext'
import { Tree, TreeNode } from 'react-organizational-chart'
import ContactlessIcon from '@mui/icons-material/Contactless'
import CableIcon from '@mui/icons-material/Cable'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeployGateway from './DeployGateway'
import HorizontalBars from './CostBarGraph'
import CostBarGraph from './CostBarGraph'
import SolarUsage from './PMGraphs/SolarUsage'
import GridUsage from './PMGraphs/GridUsage'
import GridIn from './PMGraphs/GridIn'
import GridOut from './PMGraphs/GridOut'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExpandLess from '@mui/icons-material/ExpandLess'
import IconButton from '@mui/material/IconButton'
import GatewayDataCard from '../widgets/gateway_data_card '
import Group from '../../assets/images/Group.svg'
import Group1 from '../../assets/images/Group1.svg'
import Group2 from '../../assets/images/Group2.svg'
import Group3 from '../../assets/images/Group3.svg'
import Group4 from '../../assets/images/Group4.svg'
import Rectangle from '../../assets/images/Rectangle48.svg'
import ProjectChartBar from './PMGraphs/ProjectChartBar'
import GatewayEnergyPerDay from './PMGraphs/GatewayEnergyPerDay'
import CircularNode from "../dashboard/project_node";
import SecondAnimatedSVGEdge from "../dashboard/animatedSVG";
import dayjs from 'dayjs'

import solar from '../../assets/images/solar-panel .svg'
import panel2 from '../../assets/images/panel2.svg'

import electricpole from '../../assets/images/electricpole.svg'
import powergrid from '../../assets/images/powergrid.svg'

import load from '../../assets/images/load.svg'
import fire from '../../assets/images/fire.svg'

import generator from '../../assets/images/generator.svg'
import genratorr from '../../assets/images/genratorr.svg'
import gridark from '../../assets/images/gridark.svg'; 
import genset from '../../assets/images/genset.svg';
import abcc from '../../assets/images/abcc.svg';



import StepEdge from '../dashboard/stepedge';
import '@xyflow/react/dist/style.css';



const nodeTypes = {
  circular: CircularNode,
};
const edgeTypes = {

  animatedSvg: SecondAnimatedSVGEdge
};


const ProjectManager = () => {


  const proOptions = { hideAttribution: true };



  const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark';
  

  const location = useLocation()
  const navigate = useNavigate()

  const project_id = location.state?.projectId || ''
  const [dropdownGateways, setDropdownGateways] = useState([])

  const [gateways, setGateways] = useState([])
  const [metadataData, setMetadataData] = useState({})
  const {
    projectName,
    projectId,
    longitude,
    latitude,
    address,
    connected_gateways = [],
    user,
    admin,
  } = location.state || {};

  const [role, setRole] = useState('')
  const [expandedAnalyzers, setExpandedAnalyzers] = useState({})
  const [expandedGateways, setExpandedGateways] = useState({})
  const { gateway: clickedGateway } = location.state || {}
  const [totalEnergy, setTotalEnergy] = useState('0');
  const [Energy, setEnergy] = useState('0');
  const [totalgrid, setGridData] = useState('0');
  const [totalsolar, setSolarData] = useState('0');
  const [totalgenset, setGensetData] = useState('0');
  const [totalgride, setTotalgride] = useState('0');
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [grids, setgrids] = useState('0');
  const [solars, setsolars] = useState('0');
  const [gensets, setgensets] = useState('0');

  console.log("values: ", solars);

  const initialEdges = [
    {
      id: '1-3',
      type: 'animatedSvg',
      source: '1',
      target: '3',
    },
    {
      id: '2-3',
      type: 'animatedSvg',
      source: '2',
      target: '3',
    },
    {
      id: '3-4',
      type: 'straight',
      source: '3',
      target: '4',
    },
  ];

  const [edges, setEdges] = useState(initialEdges);

const [nodes, setNodes] = useState([
  {
    id: '1',
    type: 'circular',
    data: {
      label: 'Solar',
      image: solar,
      image2: panel2,
      status: true,
      power: `${solars} kW`,
      outgoingHandlePosition: 'bottom',
      incomingHandlePosition: 'left',
    },
    position: { x: 70, y: 25 },
  },
  {
    id: '2',
    type: 'circular',
    data: {
      label: 'Grid',
      image: electricpole,
      image2: powergrid,
      status: true,
      power: `${grids} kW`,
      outgoingHandlePosition: 'bottom',
      incomingHandlePosition: 'right',
    },
    position: { x: 330, y: 25 },
  },
  {
    id: '3',
    type: 'circular',
    data: {
      label: 'Load',
      image: load,
      image2: fire,
      status: true,
      // 🔑 Show Solar, Grid, Genset, and Total
      power: `${Energy} kW`,
      incomingHandlePosition: 'top',
      outgoingHandlePosition: 'bottom',
    },
    position: { x: 200, y: 180 },
  },
  {
    id: '4',
    type: 'circular',
    data: {
      label: 'Genset',
      image: generator,
      image2: genratorr,
      status: true,
      power: `${gensets} kW`,
      incomingHandlePosition: 'top',
      outgoingHandlePosition: 'top',
    },
    position: { x: 200, y: 330 },
  },
]);


  // Update node power values dynamically
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === '1') {
          node.data.power = `${solars} kW`;
        } else if (node.id === '2') {
          node.data.power = `${grids} kW`;
        } else if (node.id === '3') {
          node.data.power = `${Energy} kW`;
        } else if (node.id === '4') {
          node.data.power = `${gensets} kW`;
        }
        return { ...node };
      })
    );
  }, [solars, grids, gensets]);

  const toggleGatewayExpansion = (gatewayName) => {
    setExpandedGateways((prev) => {
      const isExpanding = !prev[gatewayName]

      if (isExpanding) {
        const selectedGatewayData = gateways.find((gw) => gw.gateway_name === gatewayName)
        const gatewayId = selectedGatewayData ? selectedGatewayData.G_id : null

        if (gatewayId) {
          localStorage.setItem('selectedGatewayId', gatewayId)
        }

        // Save selected gateway name per project
        let storedGateways = JSON.parse(localStorage.getItem('selectedGateways')) || {}
        storedGateways[project_id] = gatewayName
        localStorage.setItem('selectedGateways', JSON.stringify(storedGateways))

        // Update the local state
        setSelectedGatewayForDropdown(gatewayName)
      }

      return {
        ...prev,
        [gatewayName]: isExpanding,
      }
    })
  }

    useEffect(() => {
      if (!clickedGateway || !clickedGateway.gateway_name) return;

      const gatewayName = clickedGateway.gateway_name;
      let interval;
  
    const fetchData = async () => {
      try {
        const res = await axios.get(urls.Total_activepower(gatewayName));
        const data = res.data;
        setLastUpdateTime(dayjs())
        const Grid = data.latest_active_power.Grid.total;
        const Generator = data.latest_active_power.Generator.total;
        const Solar = data.latest_active_power.Solar.total;
  
        setgrids(Grid.toFixed(2));
        setsolars(Solar.toFixed(2));
        setgensets(Generator.toFixed(2));

        const total = (Grid + Solar + Generator).toFixed(2);
      setEnergy(total);

        
        
  
  
      } catch (err) {
        console.error("Failed to fetch energy data", err);
      }
    };
  
  
      fetchData();
      interval = setInterval(fetchData, 5000);
  
      return () => clearInterval(interval);
    }, [clickedGateway]);
  
  // useEffect(() => {
  //   const storedGateways = JSON.parse(localStorage.getItem("selectedGateways")) || {};
  //   const defaultGateway = storedGateways[project_id];

  //   if (defaultGateway) {
  //     setExpandedGateways(prev => ({
  //       ...prev,
  //       [defaultGateway]: true,
  //     }));
  //   }
  // }, [gateways]); // or after fetching dropdownGateways
  const toggleAnalyzer = (key) => {
    setExpandedAnalyzers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setRole(user.role || '') // Set role from localStorage
    }
  }, [])

  
    useEffect(() => {
  if (!clickedGateway || !clickedGateway.gateway_name) return;

  const gatewayName = clickedGateway.gateway_name;
  let interval;

  const fetchLatest = async () => {
    try {
      const res = await axios.get(urls.Energy_Summarys(gatewayName));
      const data = res.data;

      if (!data || data.length === 0) return;

      const latest = data[data.length - 1]; // assuming sorted from oldest to newest

      const gridVal = latest["Grid_EP+"] || 0;
      const solarVal = latest["Solar_EP+"] || 0;
      const gensetVal = latest["Generator_EP+"] || 0;
      const gridexportVal = latest["Grid_EP-"] || 0;
      setGridData(gridVal);
      setSolarData(solarVal);
      setGensetData(gensetVal);
      setGensetData(gensetVal);
      setTotalgride(gridexportVal);
      const total = (gridVal + solarVal + gensetVal).toFixed(2);
      setTotalEnergy(total);

      setCurrentValues({
        Load: gridVal + solarVal + gensetVal,
        Grid: gridVal,
        Solar: solarVal,
        Genset: gensetVal,
        gride:gridexportVal
      });
    } catch (err) {
      console.error("Failed to fetch latest energy data", err);
    }
  };

  fetchLatest();
  interval = setInterval(fetchLatest, 5000);

  return () => clearInterval(interval);
}, [clickedGateway]);

  const [selectedGatewayForDropDown, setSelectedGatewayForDropdown] = useState(() => {
    const storedGateways = JSON.parse(localStorage.getItem('selectedGateways')) || {}
    return storedGateways[project_id] || '' // Get the correct gateway for the project
  })

  const backgroundStyle =
    theme.palette.mode === 'light'
      ? `linear-gradient(to right, rgba(201, 202, 203, 0.91), rgba(209, 207, 207, 0.3)), url('https://i0.wp.com/calmatters.org/wp-content/uploads/2021/11/clean-energy-power-grid.jpg?fit=1836%2C1059&ssl=1') center/cover no-repeat`
      : `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(25, 25, 25, 0.6)), url('https://i0.wp.com/calmatters.org/wp-content/uploads/2021/11/clean-energy-power-grid.jpg?fit=1836%2C1059&ssl=1') center/cover no-repeat`

  /////// fetchDeployedGatewaysForDropdown //////
  useEffect(() => {
    const fetchDeployedGatewaysForDropdown = async () => {
      try {
        const response = await axios.get(`${urls.getGatewaysForDropdown}?project_id=${project_id}`)
        const data = response.data.deployed_gateways
        setDropdownGateways(data)

        // Retrieve stored gateways from localStorage
        let storedGateways = JSON.parse(localStorage.getItem('selectedGateways')) || {}

        // Get the selected gateway for the current project
        const storedGateway = storedGateways[project_id]

        // Ensure the stored gateway exists in the current project
        if (storedGateway && data.some((gw) => gw.gateway_name === storedGateway)) {
          setSelectedGatewayForDropdown(storedGateway)
        } else {
          setSelectedGatewayForDropdown('') // Reset if no valid stored gateway
        }
      } catch (error) {
        console.error('Error fetching gateways for dropdown', error)
      }
    }

    fetchDeployedGatewaysForDropdown()
    const intervalId = setInterval(fetchDeployedGatewaysForDropdown, 5000)
    return () => clearInterval(intervalId)
  }, [project_id])

  ///// fetchdeployedgateways /////
  useEffect(() => {
    const fetchDeployedGateways = async () => {
      try {
        const response = await fetch(`${urls.fetchDeployedGateways}?project_id=${project_id}`)
        const data = await response.json()
        console.log('Fetched Deployed Gateways:', data)

        if (response.ok) {
          const fetchedGateways = data.deployed_gateways || []
          console.log('fetched deployed gateways:', fetchedGateways)
          setGateways(fetchedGateways)
        } else {
          setError(data.message || 'Failed to fetch gateways')
        }
      } catch (err) {
        setError('Error occurred while fetching data')
        console.error(err)
      }
    }

    fetchDeployedGateways()

    const intervalId = setInterval(fetchDeployedGateways, 5000)
    return () => clearInterval(intervalId)
  }, [project_id])

  /////// fetchDeployedGatewaysForDropdown //////
  useEffect(() => {
    const fetchDeployedGatewaysForDropdown = async () => {
      try {
        const response = await axios.get(`${urls.getGatewaysForDropdown}?project_id=${project_id}`)
        const data = response.data.deployed_gateways
        setDropdownGateways(data)
      } catch (error) {
        console.error('Error fetching gateways for dropdown', error)
      }
    }

    fetchDeployedGatewaysForDropdown()
    const intervalId = setInterval(fetchDeployedGatewaysForDropdown, 5000)
    return () => clearInterval(intervalId)
  }, [project_id])

  // ✅ Fetch metadata when gateways change
  useEffect(() => {
    const fetchMetadataForGateways = async () => {
      const metadataResults = {}

      for (const gateway of gateways) {
        const gatewayName = gateway.gateway_name

        try {
          const response = await axios.get(urls.fetch_Metadata(gatewayName))
          metadataResults[gatewayName] = response.data
          console.log('Meta Data:', response.data)
        } catch (error) {
          console.error(`Error fetching clicked metadata for gateway ${gatewayName}:`, error)
        }
      }

      setMetadataData(metadataResults) // ✅ Update state
    }

    if (gateways.length > 0) {
      fetchMetadataForGateways() // ✅ Fetch metadata when gateways exist
    }
  }, [gateways])

  ///// FetchAnalyzerData /////

  // navigation to project chart page

  const navigateToChart = (valueName, gatewayName, address, value) => {
    navigate(`/dashboard/projectchart/${gatewayName}/${valueName}`, {
      state: { address, value }, // ✅ Pass additional data to the next screen
    })
  }

  const getIconAndBgColor = (purpose) => {
    if (purpose === 'Gateway') {
      return {
        icon: null,
        bgColor: '', // Deep Blue & Modern Green
        mainBoxBg: theme.palette.background.gatewaycard,
      }
    } else if (['COM1', 'COM2', 'ETH1', 'ETH2'].includes(purpose)) {
      return {
        icon: <CableIcon fontSize="large" />,
        bgColor: 'linear-gradient(135deg, #D32F2F, #B71C1C)', // Bold Red for Connections
        mainBoxBg: theme.palette.background.card,
      }
    } else if (purpose === 'Analyzer') {
      return {
        icon: null,
        bgColor: '', // Professional Teal & Deep Green
        mainBoxBg: theme.palette.background.gatewaycard,
      }
    } else {
      return {
        icon: <ContactlessIcon fontSize="large" />,
        bgColor: 'linear-gradient(135deg, #E8489E, #E62E8E, #D32999, #A31DB3, #9F1CB5, #8723C1)', // Elegant Dark Gray
        mainBoxBg: theme.palette.background.card,
      }
    }
  }
  const TreeBox = ({ label, purpose, onClick, sticker }) => {
    const { icon, bgColor, mainBoxBg } = getIconAndBgColor(purpose)

    return (
      <Box
        sx={{
          p: '10px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.08)',

          background: mainBoxBg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minWidth: '150px',
          maxWidth: '100%',
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'visible',
        }}
        onClick={onClick}
      >
        {/* 🔴 Top-Right Sticker */}
        {sticker && (
          <Box
            sx={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background:
                'linear-gradient(135deg, #E8489E, #E62E8E, #D32999, #A31DB3, #9F1CB5, #8723C1)',
              color: 'white',
              fontSize: '12px',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              zIndex: 2,
            }}
          >
            {sticker}
          </Box>
        )}

        {/* ✅ Icon Box (aligned top-left) */}
        {icon && (
          <Box
            sx={{
              width: '50px',
              height: '50px',
              background: bgColor,
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '-12px',
              left: '10px', // aligned to the left
            }}
          >
            {React.cloneElement(icon, { style: { color: 'white' } })}
          </Box>
        )}

        {/* ✅ Label */}
        <Typography
          variant="subtitle1"

          sx={{
            marginTop: icon ? '40px' : '0px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {label}
        </Typography>
      </Box>
    )
  }
  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <Box sx={{ p: 2 }}>

{lastUpdateTime && (
  <Box 
    display="flex" 
    flexDirection="row"            // 👈 row instead of column
    justifyContent="space-between" // 👈 left & right alignment
    alignItems="center" 
    margin="0 1rem"
  >
    {/* Left Side */}
    {role === "superadmin" && (
      <Typography 
        variant="body2" 
        color="text.primary" 
        sx={{ fontWeight: "bold", fontSize: "1.8rem" }}
      >
        {admin} | {user} | {projectName}
      </Typography>
    )}

    {/* Right Side */}
    <Typography variant="body2" color="text.primary">
      {`Last Update: ${lastUpdateTime.format('YYYY-MM-DD HH:mm:ss')}`}
    </Typography>
  </Box>
)}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <GatewayDataCard
          title={totalEnergy || "0.00"}
          subtitle="Today's Total Energy"
          icon={<img src={Group} alt="Group Icon" />}
          bgColor=" #7978E9
      " // Blue
        />
        <GatewayDataCard
          title={totalgrid || "0.00"}
          subtitle="Today's Grid Import Energy"
          icon={<img src={Group1} alt="Group Icon" />}
          bgColor=" #2FC87B" // Blue
        />

        <GatewayDataCard
          title={totalsolar || "0.00"}
          subtitle="Today’s Solar Energy"
          icon={<img src={Group2} alt="Group Icon" />}
          bgColor=" #F3797E"
        />
        <GatewayDataCard
          title={totalgride || "0.00"}
          subtitle="Today's Grid Export Energy"
          icon={<img src={Group3} alt="Group Icon" />}
          bgColor="#0DCAF0" // Blue
        />
        <GatewayDataCard
          title={totalgenset || "0.00"}
          subtitle="Today’s Generator Energy"
          icon={<img src={Group4} alt="Group Icon" />}
          bgColor="#35AC70" // Blue
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
        {/* Left Box - Project Info */}

        <Box
             p={2}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: '10px',
            flex: '1 1 300px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd',
            flexDirection: { xs: 'column', sm: 'row' },

          }}
          display="flex"
          flexDirection="row"

        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
         
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color=' #24A58D;'>
                {projectName}
                
              </Typography>
              <Typography variant="body2">
                Project name
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} color=' #24A58D;'>
                {capitalize(clickedGateway ? clickedGateway.gateway_name : 'Gateway')}
              </Typography>
              <Typography variant="body2">
                Gateway name
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {clickedGateway ? clickedGateway.mac_address : 'Gateway'}
                
              </Typography>
              <Typography variant="body2">
                Mac Address
              </Typography>
            </Box>
          </Box>


          <Box
            sx={{
              flex: '1 1 200px',
              mt: { xs: 2, sm: 0 },
              ml: { sm: 2 },
              maxWidth: '500px',
              height: '100%',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={Rectangle}
              alt="rectangle"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                objectFit: 'crop',
                display: 'block',
              }}
            />
          </Box>



        </Box>

        {/* Right Box -react flow */}
        <Box
          p={2}
          sx={{
            flex: '1 1 300px',
            width: { xs: '100%', sm: '50%', md: '50%' },
            minHeight: '319px',
            maxHeight: '60vh',
            overflow: 'hidden',


            background: theme.palette.background.paper,
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd',
            // flex: 1,
            ml: 2, // add some space between the boxes
          }}
        >
          {/* Right box content goes here */}
          <ReactFlow
            nodes={nodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}



            fitView
          >
          </ReactFlow>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
        {/* Left Box - Project Info */}
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
            color="#2B344A"
            sx={{
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
        <Box
          p={2}
          sx={{
            maxWidth: '450px',           
            background: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd',
            flex: '1 1 auto',
          }}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <ProjectChartBar />
          </Box>


        </Box>


        {/* Right Box - Empty or content */}
        <Box
          p={2}
          sx={{
           maxWidth: '100%',    
           flex: '1 1 45%',     
           height: '400px', 
            mt:'15px',
            background: '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd',
        
            // ml: 2, 
           
            
          
          }}
        >
          {/* Right box content goes here */}
          <GatewayEnergyPerDay />
        </Box>

      </Box>

      {/* Responsive Grid Layout */}

<Grid item xs={12} mt={3}>
  {/* Right Side: Gateways List */}
  <Box>
    <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
      {dropdownGateways.length > 0 ? (
        dropdownGateways
          .filter((gw) => gw.gateway_name === clickedGateway.gateway_name)
          .map((gw) => (
            <Box key={gw.mac_address} sx={{ mb: 1 }}>
              {/* Gateway Header */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                {/* Expanded Content */}
                <Box sx={{ mt: 1, width: '100%' }}>
                  {metadataData[gw.gateway_name] ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        flexWrap: 'wrap',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      {metadataData[gw.gateway_name].ports.map((port, portIndex) => (
                        <Box
                          key={portIndex}
                          sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 280px' },
                            background: theme.palette.background.paper,
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #ddd',
                            borderRadius: '12px',
                            p: 2,
                            position: 'relative',
                          }}
                        >
                          {/* Port Name Sticker */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '-8px',
                              right: { xs: '0', sm: '-10px' },
                              background: `linear-gradient(135deg,#E8489E 0%,#E62E8E 20%,#D32999 40%, #A31DB3 60%,#9F1CB5 80%, #8723C1 100%)`,
                              color: 'white',
                              fontSize: { xs: '10px', sm: '12px' },
                              px: 1.5,
                              py: 0.5,
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {port.port_name}
                          </Box>

                          {/* Analyzer Boxes */}
                          {port.analyzers.map((analyzer, analyzerIndex) => {
                            const analyzerKey = `${gw.gateway_name}-${port.port_name}-${analyzer.name}`;
                            const isExpanded = expandedAnalyzers[analyzerKey] || false;

                            return (
                              <Box key={analyzerIndex} sx={{ mt: 2, width: '100%' }}>
                                <TreeBox
                                  purpose="Analyzer"
                                  label={
                                    <Box sx={{ width: '100%' }}>
                                      {/* Top Row */}
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: { xs: 'column', sm: 'row' },
                                          justifyContent: 'space-between',
                                          alignItems: { xs: 'flex-start', sm: 'center' },
                                          gap: 1,
                                        }}
                                      >
                                        {/* Analyzer Name */}
                                        <Typography
                                          variant="subtitle1"
                                          sx={{
                                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
                                            fontWeight: 'bold',
                                            wordBreak: 'break-word',
                                          }}
                                        >
                                          {analyzer.name}
                                        </Typography>

                                        {/* Right-side icons */}
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mt: { xs: 1, sm: 0 },
                                          }}
                                        >
                                          {/* Analyzer Type Icon */}
                                          {analyzer.type === 'Grid' && (
                                            <img
                                              src={isDarkMode ? gridark : 'https://mexemai.com/bucket/ems/image/gridcolor.png'}
                                              alt="Grid Icon"
                                              style={{ height: 24, width: 24 }}
                                            />
                                          )}
                                          {analyzer.type === 'Solar' && (
                                            <img
                                              src={isDarkMode ? genset : 'https://mexemai.com/bucket/ems/image/solarcolored.png'}
                                              alt="Solar Icon"
                                              style={{ height: 24, width: 24 }}
                                            />
                                          )}
                                          {analyzer.type === 'Generator' && (
                                            <img
                                              src={isDarkMode ? abcc : 'https://mexemai.com/bucket/ems/image/generator.png'}
                                              alt="Generator Icon"
                                              style={{ height: 24, width: 24 }}
                                            />
                                          )}
                                          {analyzer.type === 'other' && (
                                            <img
                                              src={isDarkMode ? abcc : 'https://mexemai.com/bucket/ems/image/generator.png'}
                                              alt="Generator Icon"
                                              style={{ height: 24, width: 24 }}
                                            />
                                          )}

                                          {/* Status Dot */}
                                          <Box
                                            sx={{
                                              width: 10,
                                              height: 10,
                                              borderRadius: '50%',
                                              backgroundColor: analyzer.status ? 'green' : 'red',
                                            }}
                                          />

                                          {/* Expand Button */}
                                          <IconButton size="small" sx={{ p: 0 }}>
                                            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                          </IconButton>
                                        </Box>
                                      </Box>

                                      {/* Bottom Row: Values in one horizontal line */}
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: 1,
                                          mt: 1,
                                          overflowX: 'auto',
                                          width: '100%',
                                          pb: 1,
                                        }}
                                      >
                                        {analyzer.values
                                          .filter((val) =>
                                            ['EP+', 'EP-','active power', 'Current', 'Volt', 'P.F', 'Freq'].includes(val.name)
                                          )
                                          .map((val, idx) => (
                                            <Box
                                              key={idx}
                                              sx={{
                                                minWidth: '50px',
                                                textAlign: 'center',
                                                background: theme.palette.background.default,
                                                borderRadius: '5px',
                                                p: 1,
                                                flexShrink: 0,
                                              }}
                                            >
                                              <Typography
                                                variant="body2"
                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                              >
                                                {val.name}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, fontWeight: 600 }}
                                              >
                                                {val.value}
                                              </Typography>
                                            </Box>
                                          ))}
                                      </Box>

                                      <hr style={{ width: '100%', margin: '0.5rem 0' }} />

                                      {/* Expanded Details */}
                                      {isExpanded && (
                                        <Box
                                          sx={{
                                            p: 1,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                          }}
                                        >
                                          {analyzer.values.map((val, valIndex) => (
                                            <Box
                                              key={valIndex}
                                              sx={{
                                                flex: '1 1 45%',
                                                minWidth: '120px',
                                                p: '5px',
                                                background: theme.palette.background.default,
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                  transform: 'translateY(-2px)',
                                                  boxShadow: 2,
                                                },
                                              }}
                                              onClick={() => navigateToChart(val.name, gw.gateway_name)}
                                            >
                                              <Grid container columnGap={1}>
                                                <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
                                                  <b>{val.name}</b>
                                                </Typography>
                                                <Divider orientation="vertical" flexItem />
                                                <Typography variant="subtitle2">{val.value}</Typography>
                                                <Divider orientation="vertical" flexItem />
                                                <Typography variant="subtitle2">{val.address}</Typography>
                                              </Grid>
                                            </Box>
                                          ))}
                                        </Box>
                                      )}
                                    </Box>
                                  }
                                  onClick={() => toggleAnalyzer(analyzerKey)}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: theme.palette.action.hover,
                                    },
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <TreeBox label="No metadata available." />
                  )}
                </Box>
              </Box>
            </Box>
          ))
      ) : (
        <Typography variant="body2">No gateways available</Typography>
      )}
    </Box>
  </Box>
</Grid>

    </Box>
  )
}

export default ProjectManager
