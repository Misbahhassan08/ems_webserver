import React, { useEffect, useState } from "react"; 
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import { Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import urls from "../../../urls/urls";

const GatewayEnergyPerDay = () => {
  const theme = useTheme();
  const location = useLocation();
  const { gateway: clickedGateway } = location.state || {};
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
        const data = response.data.today_active_power;

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
    const interval = setInterval(fetchEnergyData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [clickedGateway]);

  const textColor = "#AFB2C1";

  const options = {
    chart: {
      type: "areaspline",
      height: 300,
      backgroundColor: "#FFFFFF",
      style: { fontFamily: "Arial, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories,
      title: { text: "Hours", style: { color: textColor } },
      labels: { style: { color: textColor }, step: 1 },
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
      align: "center",
      verticalAlign: "top",
      layout: "horizontal",
      y: 20,
    },
    plotOptions: {
      areaspline: {
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 2,
          fillColor: "white",
          lineColor: null,
          lineWidth: 2,
        },
      },
    },
    colors: ["#1F2A40", "#64de1d", "#de1dc8"],
    series: [
      { name: "Grid KW", data: gridData },
      { name: "Solar KW", data: solarData },
      { name: "Genset KW", data: gensetData },
    ],
    credits: { enabled: false },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            legend: { itemStyle: { fontSize: "10px" } },
            yAxis: { labels: { style: { fontSize: "10px" } } },
            xAxis: { labels: { style: { fontSize: "10px" } } },
          },
        },
      ],
    },
  };

  return (
    <div
      style={{
        padding: 8,
        borderRadius: 10,
        width: "100%",
        background: "#FFFFFF",
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} fontSize={14} mb={1}>
        Energy Overview (Last 24 Hours)
      </Typography>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { width: "100%" } }}
      />
    </div>
  );
};

export default GatewayEnergyPerDay;
