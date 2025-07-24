import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import urls from "../../../urls/urls"
// Define the API endpoints
const GatewayEnergyPerDay = () => {

  
  const theme = useTheme();
  const location = useLocation();
  const { gateway: clickedGateway } = location.state || {}
  const [gridData, setGridData] = useState([]);
  const [solarData, setSolarData] = useState([]);
  const [gensetData, setGensetData] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchEnergyData = async () => {
    if (!clickedGateway || !clickedGateway.gateway_name) return;
    const gatewayName = clickedGateway.gateway_name;
      try {
        const response = await axios.get(urls.ENERGY_API_URL(gatewayName));
        const data = response.data.active_power_last_24_hours;
        const groupByHour = (entries) => {
        const hourlyData = new Array(24).fill(0);
          entries.forEach((entry) => {
            const hour = new Date(entry.time).getHours();
            hourlyData[hour] += entry.value;
          });
          return hourlyData.map((v) => parseFloat(v.toFixed(2)));
        };
        setGridData(groupByHour(data.Grid || []));
        setSolarData(groupByHour(data.Solar || []));
        setGensetData(groupByHour(data.Generator || []));
        const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        setCategories(hourLabels);
      } catch (error) {
        console.error("Error fetching energy data:", error);
      }
    };
    fetchEnergyData();
    const interval = setInterval(fetchEnergyData, 10000);
    return () => clearInterval(interval);
  }, [clickedGateway]);
  const textColor = "#AFB2C1";
  
  const options = {

   
    chart: {

       height: 300,
       type: "areaspline",
 or: {
       backgroundColor: '#FFFFFF',
       
       

        // linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        // stops: [
        //   [0, "#39406D"],
        //   [1, "#1D2137"],
        // ],
      },
      style: { fontFamily: "Arial, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories,
      title: { text: "Hours", style: { color: textColor } },
      labels: { style: { color: textColor }, 
     step: 1,
    },
      lineColor: textColor,
     
    },
    yAxis: {
      title: { text: "kW", style: { color: textColor } },
      labels: { style: { color: textColor } },
      gridLineColor: "#444",
      gridLineDashStyle: "Dash",
    },
    tooltip: {
      shared: true,
      backgroundColor: "#2A2E4A",
      borderColor: "#444",
      style: { color: textColor },
      headerFormat: "<b>{point.key}</b><table>",
      pointFormat:
        '<tr><td style="padding:0 6px 0 0;">{series.name}:</td>' +
        '<td style="padding:0"><b>{point.y} kW</b></td></tr>',
      footerFormat: "</table>",
    },
     legend: {
    itemStyle: { color: textColor },
    align: 'center',
    verticalAlign: 'top',
    layout: 'horizontal',
    y: 20,
   symbolHeight: 300,   // Taller
   symbolWidth: 50,    // Wider
   symbolRadius: 0
  },
     
  plotOptions: {
  areaspline: {
    lineWidth: 2,
    marker: {
      enabled: true, // Enable markers
      symbol: 'square',
      radius: 0, 
      fillColor: 'white', 
      lineColor: null, 
      lineWidth: 2,
      // states: {
      //   hover: {
      //     enabled: true,
      //     lineColor: '#000'
      //   }
      // }
    }
  }
},

    colors: ["#1F2A40", "#64de1d", "#de1dc8"],
series: [
  {
    name: "Grid KW",
    data: gridData,
   marker: {
  enabled: true,
  symbol: 'rect',
  radius: 0,
  // fillColor: 'white',  
  // lineColor: 'blue',   
  // lineWidth: 4,        
  width: 14,           
  height: 10
}
  },
  {
    name: "Solar KW",
    data: solarData,
    marker: {
  enabled: true,
  symbol: 'rect',
  radius: 0,
  // fillColor: 'white',  
  // lineColor: 'blue',   
  // lineWidth: 4,        
  width: 14,           
  height: 10
}
  },
  {
    name: "Genset KW",
    data: gensetData,
   marker: {
  enabled: true,
  symbol: 'rect',
  radius: 0,
  // fillColor: 'white',  
  // lineColor: 'blue',   
  // lineWidth: 4,       
  width: 14,           
  height: 10
}
  }
],
    credits: {
      enabled: false,
    },
  };
  return (
    <div
      style={{
        padding: 8,
        borderRadius: "10px",
        width: "95%",
        // height: "100px",
        background:  '#FFFFFF',
        marginBottom: 16,
        overflow: 'hidden', // hides overflow
        // minWidth:0
      
      }}
      
    
    >
      <Typography variant="subtitle2" fontWeight={600} fontSize={14} mb={1}>
        Energy Overview (Last 24 Hours)
      </Typography>
      
      
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default GatewayEnergyPerDay;