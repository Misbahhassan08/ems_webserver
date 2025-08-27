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

        const formatEntries = (entries) =>
          (entries || []).map((entry) => ({
            time: new Date(entry.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: parseFloat(entry.value.toFixed(2)),
          }));

        const grid = formatEntries(data.Grid);
        const solar = formatEntries(data.Solar);
        const genset = formatEntries(data.Generator);

        setGridData(grid.map((e) => e.value));
        setSolarData(solar.map((e) => e.value));
        setGensetData(genset.map((e) => e.value));

        const allTimes = [...grid, ...solar, ...genset].map((e) => e.time);
        setCategories(allTimes);
      } catch (error) {
        console.error("Error fetching energy data:", error);
      }
    };

    fetchEnergyData();
    const interval = setInterval(fetchEnergyData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [clickedGateway]);

  const textColor = "#4A4A4A";

  const options = {
    chart: {
      type: "areaspline",
      height: 350,
      backgroundColor: "#fff",
      style: { fontFamily: "Inter, Arial, sans-serif" },
    },
    title: { text: "" },
    xAxis: {
      categories,
      title: { text: "Time", style: { color: textColor, fontSize: "13px" } },
      labels: { style: { color: textColor, fontSize: "11px" }, step: 2 },
      lineColor: "#ccc",
    },
    yAxis: {
      title: { text: "kW", style: { color: textColor, fontSize: "13px" } },
      labels: { style: { color: textColor, fontSize: "11px" } },
      gridLineColor: "#eee",
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: "#fff",
      borderRadius: 8,
      borderColor: "#ccc",
      shadow: true,
      style: { color: "#333", fontSize: "12px" },
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y} kW</b><br/>',
    },
    legend: {
      itemStyle: { color: textColor, fontWeight: "500" },
      align: "center",
      verticalAlign: "top",
      layout: "horizontal",
      y: 10,
    },
plotOptions: {
  areaspline: {
    lineWidth: 0.5,   // 👈 thinner line
    marker: {
      enabled: true,
      symbol: "circle",
      radius: 1,
      states: { hover: { enabled: true, radius: 6 } },
    },
    fillOpacity: 0.3,
  },
  series: {
    animation: { duration: 800 },
  },
},

    colors: ["#1E88E5", "#43A047", "#E53935"],
    series: [
      {
        name: "Grid",
        data: gridData,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(30,136,229,0.8)"],
            [1, "rgba(30,136,229,0.1)"],
          ],
        },
      },
      {
        name: "Solar",
        data: solarData,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(67,160,71,0.8)"],
            [1, "rgba(67,160,71,0.1)"],
          ],
        },
      },
      {
        name: "Genset",
        data: gensetData,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(229,57,53,0.8)"],
            [1, "rgba(229,57,53,0.1)"],
          ],
        },
      },
    ],
    credits: { enabled: false },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            chart: { height: 250 },
            legend: {
              itemStyle: { fontSize: "10px" },
            },
            xAxis: {
              labels: { style: { fontSize: "9px" } },
            },
            yAxis: {
              labels: { style: { fontSize: "9px" } },
            },
            tooltip: { style: { fontSize: "10px" } },
          },
        },
      ],
    },
  };

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        width: "100%",
        background: "#fff",
        marginBottom: 16,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={600}
        fontSize={15}
        mb={1}
        color="#333"
      >
        ⚡ Energy Overview (Last 24 Hours)
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
