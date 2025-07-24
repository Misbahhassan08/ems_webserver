import React, { useEffect, useState, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { toPng, toSvg } from "html-to-image";
import urls from "../../../urls/urls";

function ProjectChart() {
  const { projectId: paramProjectId = "1" } = useParams();
  const location = useLocation();
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [unit, setUnit] = useState("kWh");
  const [downloadFormat, setDownloadFormat] = useState("png");
  const chartWrapperRef = useRef(null);

  const project_id = location.state?.projectId || paramProjectId;

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(urls.totalload, {
          params: {
            Project_id: project_id,
            start_date: startDate.format("YYYY-MM-DD"),
            end_date: endDate.format("YYYY-MM-DD"),
          },
        });

        const data = response.data?.["EP+_By_Date_Range"] || {};

        const formatSeries = (category) => {
          const entries = data[category] || {};
          return Object.entries(entries).map(([date, value]) => ({
            name: date,
            y: parseFloat(value),
          }));
        };

        const newSeries = [
          { name: "Solar", data: formatSeries("Solar") },
          { name: "Grid", data: formatSeries("Grid") },
          { name: "Generator", data: formatSeries("Generator") },
        ];

        setChartData(newSeries);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [startDate, endDate, project_id]);

  const handleDownload = async () => {
    if (!chartWrapperRef.current) return;

    try {
      const dataUrl =
        downloadFormat === "svg"
          ? await toSvg(chartWrapperRef.current, { backgroundColor: "#ffffff" })
          : await toPng(chartWrapperRef.current, { backgroundColor: "#ffffff" });

      const link = document.createElement("a");
      link.download = `chart.${downloadFormat}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
          <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
          <DatePicker label="End Date" value={endDate} onChange={setEndDate} />

          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
          </select>

          <button
            onClick={handleDownload}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            📥 Download ({downloadFormat.toUpperCase()})
          </button>
        </div>

        <DailyChart
          title="EP+ Energy Usage Over Time"
          data={chartData}
          yAxisLabel={unit}
          chartWrapperRef={chartWrapperRef}
        />
      </div>
    </LocalizationProvider>
  );
}

function DailyChart({ title, data, yAxisLabel, chartWrapperRef }) {
  const chartRef = useRef(null);

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "white",
    },
    title: { text: title },
    xAxis: {
      type: "category",
      title: { text: "Date" },
      labels: { rotation: -45, style: { fontSize: "12px" } },
      lineWidth: 1,
    },
    yAxis: {
      title: { text: yAxisLabel },
      gridLineWidth: 1,
      lineWidth: 1,
    },
    series: data,
    credits: { enabled: false },
    plotOptions: {
      series: {
        animation: { duration: 600 },
        marker: { enabled: false },
      },
    },
  };

  return (
    <div
      ref={chartWrapperRef}
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        padding: "10px",
      }}
    >
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  );
}

export default ProjectChart;
