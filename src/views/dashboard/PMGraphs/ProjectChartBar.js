import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, useTheme, LinearProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import urls from "../../../urls/urls"




const ProjectChartBar = () => {
  const theme = useTheme();
  const location = useLocation();
  const { gateway: clickedGateway } = location.state || {};
  
  const [gridData, setGridData] = useState([]);
  const [solarData, setSolarData] = useState([]);
  const [gensetData, setGensetData] = useState([]);
  const [categories, setCategories] = useState([]);
   const [totalEnergy, setTotalEnergy] = useState('0'); 
    const [totalgrid, setTotalgrid] = useState('0');
    const [totalsolar, setTotalsolar] = useState('0');
    const [totalgenset, setTotalgenset] = useState('0');



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

      setTotalgrid(Grid.toFixed(2));
      setTotalsolar(Solar.toFixed(2));
      setTotalgenset(Generator.toFixed(2));
     

      const total = (Grid + Solar + Generator).toFixed(2);
      setTotalEnergy(total);


    } catch (err) {
      console.error("Failed to fetch energy data", err);
    }
  };


    fetchData();
    interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [clickedGateway]);



  useEffect(() => {
    if (!clickedGateway || !clickedGateway.gateway_name) return;

    const gatewayName = clickedGateway.gateway_name;
    let interval;

    const fetchData = async () => {
      try {
        const res = await axios.get(urls.Energy_Summarys(gatewayName));
        const data = res.data.reverse(); // oldest to newest

        const grid = [], solar = [], genset = [], days = [];

        data.forEach((entry) => {
          grid.push(entry["Grid_EP+"] || 0);
          solar.push(entry["Solar_EP+"] || 0);
          genset.push(entry["Generator_EP+"] || 0);

          const dayName = new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "short",
          });
          days.push(dayName);
        });

        setGridData(grid);
        setSolarData(solar);
        setGensetData(genset);
        setCategories(days);

        const latest = data[data.length - 1];
        const gridVal = latest["Grid_EP+"] || 0;
        const solarVal = latest["Solar_EP+"] || 0;
        const gensetVal = latest["Generator_EP+"] || 0;

        setCurrentValues({
          Load: gridVal + solarVal + gensetVal,
          Grid: gridVal,
          Solar: solarVal,
          Genset: gensetVal,
        });

      } catch (err) {
        console.error("Failed to fetch energy data", err);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [clickedGateway]);


  const options = {
    chart: {
      type: "column",
      borderRadius: "10px",
      height: 280,
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, "#39406D"],
          [1, "#1D2137"],
        ],
      },
      style: { fontFamily: "Arial, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories,
      crosshair: true,
      lineColor: "#AFB2C1",
      labels: { style: { color: "#AFB2C1", fontSize: "10px" } },
    },
    yAxis: {
      min: 0,
      gridLineWidth: 0,
      title: { text: "" },
      labels: { style: { color: "#AFB2C1", fontSize: "10px" } },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: "#2a2e4a",
      borderColor: "#444",
      style: { color: "#AFB2C1", fontSize: "11px" },
      headerFormat: '<b style="font-size:12px;">{point.key}</b><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0 6px 0 0;">{series.name}:</td>' +
        '<td style="padding:0"><b>{point.y} kWh</b></td></tr>',
      footerFormat: "</table>",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        grouping: true,
        states: { hover: { enabled: false } },
      },
    },
    colors: ["#ffffff", "#28a745", "#6f42c1"],
    series: [
      { name: "Grid", data: gridData, color: "#ffffff" },
      { name: "Solar", data: solarData, color: "#28a745" },
      { name: "Genset", data: gensetData, color: "#6f42c1" },
    ],
    legend: { enabled: false },
    credits: { enabled: false },
  };

  return (
    <div style={{ padding: 8, borderRadius: "10px", width: "100%", height: "100%" }}>
      <Box mb={2}>
        <Typography variant="subtitle2" 
         fontSize={14} mb={1} color=" #2B344A">
          Last 7 Days Consumption (kWh)
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
       <Box>
        <Typography variant="subtitle2"  fontSize={14} mb={1.5} color=" #2B344A">
          Current Consumption (kW)
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={'row'}
          gap={1}
           color=" #2B344A"
          

        >
          {/* Shared Progress Card */}
          {[
            { label: "Load", value: totalEnergy, color: "orange"  },
            { label: "Grid", value: totalgrid, color: "#39406D" },
            { label: "Solar", value: totalsolar, color: "#28a745" },
            { label: "Genset", value: totalgenset, color: "#6f42c1" },
          ].map(({ label, value, color }) => (
<Box
  key={label}
  flex={1}
  minWidth="100px"
  sx={{ maxWidth: "120px" }}
>
  <Box display="flex" alignItems="center" gap={0.75}>
    <Box
      width={12}
      height={12}
      bgcolor={color}
      borderRadius="2px"
      boxShadow="0px 0px 6px rgba(0,0,0,0.4)" // ✅ shadow for colored square
    />
    <Typography fontSize={13} >{label}</Typography> {/* ✅ larger label text */}
  </Box>
  <Typography  mt={0.5} variant="h6">
    {value}
  </Typography> {/* ✅ larger value text */}
  <LinearProgress
    variant="determinate"
    value={value}
    sx={{
      height: 4, // ✅ smaller height
      borderRadius: 5,
      mt: 0.5,
      width:'50%',
      backgroundColor: "#2f2f2f",
      "& .MuiLinearProgress-bar": {
        backgroundColor: color,
      },
    }}
  />
</Box>

          ))}
        </Box>
      </Box>


    </div>
  );
};

export default ProjectChartBar;
