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
  } = location.state || {};

  const [role, setRole] = useState('')
  const [expandedAnalyzers, setExpandedAnalyzers] = useState({})
  const [expandedGateways, setExpandedGateways] = useState({})
  const { gateway: clickedGateway } = location.state || {}
  const [totalEnergy, setTotalEnergy] = useState('0');
  const [totalgrid, setTotalgrid] = useState('0');
  const [totalsolar, setTotalsolar] = useState('0');
  const [totalgenset, setTotalgenset] = useState('0');
  const [totalgride, setTotalgride] = useState('0');

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
        power: `${(parseFloat(grids) + parseFloat(solars)).toFixed(2)} kW`,
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
          node.data.power = `${(parseFloat(grids) + parseFloat(solars)).toFixed(2)} kW`;
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
  
        const Grid = data.latest_active_power.Grid.total;
        const Generator = data.latest_active_power.Generator.total;
        const Solar = data.latest_active_power.Solar.total;
  
        setgrids(Grid.toFixed(2));
        setsolars(Solar.toFixed(2));
        setgensets(Generator.toFixed(2));

  
  
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
  // console.log('dropdowm:', selectedGatewayForDropDown)
  //   Total Energy
  useEffect(() => {
    const fetchEnergyForGateways = async () => {
      if (!clickedGateway || !clickedGateway.gateway_name) return;

      const gatewayName = clickedGateway.gateway_name;

      try {
        const response = await axios.get(urls.ep_plus_sum(gatewayName));
        const energyValue = response.data["EP+_total_sum"] || 0;
        setTotalEnergy(energyValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", gatewayName, ":", energyValue.toFixed(2));
      } catch (error) {
        console.error(`Error fetching EP+ Sum for gateway ${gatewayName}:`, error);
        setTotalEnergy("0.00");
      }
    };

    fetchEnergyForGateways(); // Initial call
    const interval = setInterval(fetchEnergyForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [clickedGateway]);
  // total_Grid
  useEffect(() => {
    const fetchgridForGateways = async () => {
      if (!clickedGateway || !clickedGateway.gateway_name) return;

      const gatewayName = clickedGateway.gateway_name;

      try {
        const response = await axios.get(urls.grid_import(gatewayName));
        const gridValue = response.data["EP+_total_sum"] || 0;
        setTotalgrid(gridValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", gatewayName, ":", gridValue.toFixed(2));
      } catch (error) {
        console.error(`Error fetching EP+ Sum for gateway ${gatewayName}:`, error);
        setTotalgrid("0.00");
      }
    };

    fetchgridForGateways(); // Initial call
    const interval = setInterval(fetchgridForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [clickedGateway]);
  // Total_Solar
  useEffect(() => {
    const fetchsolarForGateways = async () => {
      if (!clickedGateway || !clickedGateway.gateway_name) return;

      const gatewayName = clickedGateway.gateway_name;

      try {
        const response = await axios.get(urls.solar_import(gatewayName));
        const solarValue = response.data["Total_Solar"] || 0;
        setTotalsolar(solarValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", gatewayName, ":", solarValue.toFixed(2));
      } catch (error) {
        console.error(`Error fetching EP+ Sum for gateway ${gatewayName}:`, error);
        setTotalsolar("0.00");
      }
    };

    fetchsolarForGateways(); // Initial call
    const interval = setInterval(fetchsolarForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [clickedGateway]);
  //Total Generator
  useEffect(() => {
    const fetchgensetForGateways = async () => {
      if (!clickedGateway || !clickedGateway.gateway_name) return;

      const gatewayName = clickedGateway.gateway_name;

      try {
        const response = await axios.get(urls.genset_import(gatewayName));
        const gensetValue = response.data["Total_Genrator"] || 0;
        setTotalgenset(gensetValue.toFixed(2)); // ✅ Set single string value like "3833.21"
        console.log("EP+ Sum for", gatewayName, ":", gensetValue.toFixed(2));
      } catch (error) {
        console.error(`Error fetching EP+ Sum for gateway ${gatewayName}:`, error);
        setTotalgenset("0.00");
      }
    };

    fetchgensetForGateways(); // Initial call
    const interval = setInterval(fetchgensetForGateways, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [clickedGateway]);

  useEffect(() => {
    const fetchgrideForGateways = async () => {

      if (!clickedGateway || !clickedGateway.gateway_name) return;

      const gatewayName = clickedGateway.gateway_name;

      try {

        const response = await axios.get(urls.grid_export(gatewayName));
        const grideValue = response.data["EP-_total_sum"] || 0;
        setTotalgride(grideValue.toFixed(2));
        console.log("EP+ Sum for", gatewayName, ":", grideValue.toFixed(2));
      } catch (error) {
        console.error(`Error fetching EP+ Sum for gateway ${gatewayName}:`, error);
        setTotalgride("0.00");
      }
    };

    fetchgrideForGateways(); // Initial call

    const interval = setInterval(fetchgrideForGateways, 5000); // Repeat every 5 sec
    return () => clearInterval(interval); // Cleanup on component unmount
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4"
        >
          {capitalize(clickedGateway ? clickedGateway.gateway_name : 'Gateway')}
        </Typography>
        <Typography variant="body1"
        >
          Welcome to gateway {clickedGateway ? clickedGateway.gateway_name : 'Gateway'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <GatewayDataCard
          title={(
              Number(totalsolar) +
              Number(totalgenset) +
              Number(totalgrid) -
              Number(totalgride)
            ).toFixed(2) || "0.00"}
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
            gap={1}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color=' #24A58D;'>
                Project name
              </Typography>
              <Typography variant="body2">
                {projectName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} color=' #24A58D;'>
                Gateway name
              </Typography>
              <Typography variant="body2">
                {capitalize(clickedGateway ? clickedGateway.gateway_name : 'Gateway')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Mac Address
              </Typography>
              <Typography variant="body2">
                {clickedGateway ? clickedGateway.mac_address : 'Gateway'}
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
            minHeight: 250,
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
           maxWidth: '600px',    
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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Expanded Content */}

                      <Box sx={{ mt: 1, width: '100%' }}>
                        {/* Gateway Details */}

                        {/* Ports and Analyzers */}
                        {metadataData[gw.gateway_name] ? (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              justifyContent: 'flex-start',
                              mt: 2,

                              overflowX: 'none',
                              width: '100%',

                            }}
                          >
                            {metadataData[gw.gateway_name].ports.map((port, portIndex) => (
                              <Box
                                key={portIndex}
                                sx={{
                                  minWidth: { xs: '100%', sm: '280px' },
                                  background: theme.palette.background.paper,
                                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                  border: '1px solid #ddd',
                                  borderRadius: '12px',
                                  p: 2,
                                  m: { xs: '4px 0', sm: 1 },
                                  position: 'relative',
                                }}
                              >
                                {/* Port Name Sticker */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '-8px',

                                    right: { xs: '0px', sm: '-10px' },
                                    background: `linear-gradient(135deg,#E8489E 0%,#E62E8E 20%,#D32999 40%, #A31DB3 60%,#9F1CB5 80%, #8723C1 100%)`,
                                    color: 'white',


                                    fontSize: { xs: '10px', sm: '12px' },
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '6px',
                                  }}
                                >
                                  {port.port_name}
                                </Box>

                                {/* ✅ Analyzer Boxes under this Port */}

                                {port.analyzers.map((analyzer, analyzerIndex) => {
                                  const analyzerKey = `${gw.gateway_name}-${port.port_name}-${analyzer.name}`
                                  const isExpanded = expandedAnalyzers[analyzerKey] || false

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
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  width: '100%',
                                                  gap: 1,
                                                }}
                                              >
                                                {/* Analyzer Name */}
                                                <Typography
                                                  variant="subtitle1"
                                                  sx={{
                                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.25rem' },
                                                    fontWeight: 'bold',
                                                    p: 0,
                                                  }}
                                                >
                                                  {analyzer.name}
                                                </Typography>

                                                {/* Right-side icons (icon, status, expand button) */}
                                                <Box
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                  }}
                                                >
                                                  {/* Analyzer Type Icon */}
                                                  {analyzer.type === 'Grid' && (
                                                    <img
                                                      src={
                                                        isDarkMode
                                                          ? gridark
                                                          : 'https://mexemai.com/bucket/ems/image/gridcolor.png'
                                                      }
                                                      alt="Grid Icon"
                                                      style={{ height: 24, width: 24 }}
                                                    />
                                                  )}
                                                  {analyzer.type === 'Solar' && (
                                                    <img
                                                      src={
                                                        isDarkMode
                                                          ? genset
                                                          : 'https://mexemai.com/bucket/ems/image/solarcolored.png'
                                                      }
                                                      alt="Solar Icon"
                                                      style={{ height: 24, width: 24 }}
                                                    />
                                                  )}
                                                  {analyzer.type === 'Generator' && (
                                                    <img
                                                      src={
                                                        isDarkMode
                                                          ? abcc
                                                          : 'https://mexemai.com/bucket/ems/image/generator.png'
                                                      }
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

                                            {/* Bottom Row: First 2 values + Type Icon */}
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mt: 1,
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: 1,
                                                padding: 1,
                                              }}
                                            >
                                              {' '}
                                              {/* Value Fields */}
                                              {analyzer.values
                                                .filter(val =>
                                                  ['active power', 'Current', 'Volt', 'P.F', 'Frequency'].includes(val.name)
                                                )
                                                .map((val, idx) => (
                                                  <Box
                                                    key={idx}
                                                    sx={{
                                                      textAlign: 'center',
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                       
                                                      }}
                                                    >
                                                      {val.name}
                                                    </Typography>
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                        fontWeight: 600,
                                                     
                                                      }}
                                                    >
                                                      {val.value}
                                                    </Typography>
                                                  </Box>
                                                ))}
                                         
                                              {/* Analyzer Type Icon */}
                                            </Box>
                                           
                                              

                                            <hr style={{ width: '100%', marginBottom: '0.5rem' }} />

                                            {isExpanded && (
                                              <Box
                                                sx={{
                                                  p: 1,
                                                  display: 'flex',
                                                  flexDirection: 'row',
                                                  flexWrap: 'wrap',
                                                  gap: '8px',
                                                  mt: 1,
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
                                                    onClick={() =>
                                                      navigateToChart(val.name, gw.gateway_name)
                                                    }
                                                  >
                                                    <Grid
                                                      display="flex"
                                                      flexDirection="row"
                                                      columnGap={1}
                                                    >
                                                      <Typography
                                                        variant="subtitle2"
                                                        display="flex"
                                                        flexDirection="column"
                                                      >
                                                        <Box>
                                                          <b>Name</b>
                                                        </Box>
                                                        <Box>
                                                          {val.name.trim().split(/\s+/).length >
                                                            1 ? (
                                                            // Render as column if more than one word
                                                            val.name
                                                              .split(' ')
                                                              .map((word, idx) => (
                                                                <div key={idx}>{word}</div>
                                                              ))
                                                          ) : (
                                                            // Render as row (inline text) if one word
                                                            <span>{val.name}</span>
                                                          )}
                                                        </Box>
                                                      </Typography>

                                                      <Divider orientation="vertical" flexItem />

                                                      <Typography
                                                        variant="subtitle2"
                                                        display="flex"
                                                        flexDirection="column"
                                                      >
                                                        <Box>
                                                          <b>Value</b>
                                                        </Box>
                                                        <Box>{val.value}</Box>
                                                      </Typography>

                                                      <Divider orientation="vertical" flexItem />

                                                      <Typography
                                                        variant="subtitle2"
                                                        display="flex"
                                                        flexDirection="column"
                                                      >
                                                        <Box>
                                                          <b>Address</b>
                                                        </Box>
                                                        <Box>{val.address}</Box>
                                                      </Typography>
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
                                  )
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
