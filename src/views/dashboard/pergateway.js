import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MenuItem, Select, FormControl, InputLabel, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, FormGroup, FormControlLabel, Checkbox,
  ToggleButtonGroup, ToggleButton, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import urls from "../../urls/urls";

const ProjectGatewayDropdowns = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [gateways, setGateways] = useState([]);
  const [selectedGatewayName, setSelectedGatewayName] = useState('');
  const [energyData, setEnergyData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState('table');
  const [showGrid, setShowGrid] = useState(true);
  const [showGridNegative, setShowGridNegative] = useState(true);
  const [showSolar, setShowSolar] = useState(true);
  const [showGenerator, setShowGenerator] = useState(true);

  useEffect(() => {
    axios
      .get(urls.getUserProjects())
      .then((res) => {
        if (res.data.project_managers) {
          setProjects(res.data.project_managers);
        }
      })
      .catch((err) => {
        console.error('Error fetching project managers:', err);
      });
  }, [userId]);

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    setSelectedProjectId(projectId);
    const selectedProject = projects.find((p) => p.PM_id === projectId);
    if (selectedProject) {
      setGateways(selectedProject.connected_gateways || []);
      setSelectedGatewayName('');
      setEnergyData([]);
    }
  };

  const handleGatewayChange = (event) => {
    setSelectedGatewayName(event.target.value);
    setEnergyData([]);
  };

  const fetchEnergySummary = () => {
    if (!selectedGatewayName || !startDate || !endDate) return;
    axios
      .get(urls.gatewaydata, {
        params: {
          gateway: selectedGatewayName,
          start_date: startDate.format('YYYY-MM-DD'),
          end_date: endDate.format('YYYY-MM-DD'),
        },
      })
      .then((res) => {
        setEnergyData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching energy data:', err);
      });
  };

  const downloadCSV = () => {
    if (!energyData.length) return;

    const headers = ["Date"];
    if (showGrid) headers.push("Grid EP+");
    if (showGridNegative) headers.push("Grid EP-");
    if (showSolar) headers.push("Solar EP+");
    if (showGenerator) headers.push("Generator EP+");

    const csvRows = [headers.join(",")];

    energyData.forEach((row) => {
      const values = [row.date];
      if (showGrid) values.push(row["Grid_EP+"] ?? 0);
      if (showGridNegative) values.push(row["Grid_EP-"] ?? 0);
      if (showSolar) values.push(row["Solar_EP+"] ?? 0);
      if (showGenerator) values.push(row["Generator_EP+"] ?? 0);
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `energy_summary_${selectedGatewayName || "gateway"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartOptions = {
    title: { text: 'Energy Summary' },
    xAxis: {
      categories: energyData.map((row) => row.date),
    },
    yAxis: { title: { text: 'EP+ Values' } },
    series: [
      ...(showGrid ? [{
        name: 'Grid EP+',
        data: energyData.map((row) => row["Grid_EP+"] ?? 0),
      }] : []),
      ...(showGridNegative ? [{
        name: 'Grid EP-',
        data: energyData.map((row) => row["Grid_EP-"] ?? 0),
      }] : []),
      ...(showSolar ? [{
        name: 'Solar EP+',
        data: energyData.map((row) => row["Solar_EP+"] ?? 0),
      }] : []),
      ...(showGenerator ? [{
        name: 'Generator EP+',
        data: energyData.map((row) => row["Generator_EP+"] ?? 0),
      }] : []),
    ]
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        {/* Dropdowns */}
        <Box display="flex" gap={2} mb={3} alignItems="center" ml={2}>
          <FormControl sx={{ width: 200 }} >
            <InputLabel>Project</InputLabel>
            <Select value={selectedProjectId} label="Project" onChange={handleProjectChange}>
              {projects.map((project) => (
                <MenuItem key={project.PM_id} value={project.PM_id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }} disabled={!gateways.length}>
            <InputLabel>Gateway</InputLabel>
            <Select value={selectedGatewayName} label="Gateway" onChange={handleGatewayChange}>
              {gateways.map((gateway) => (
                <MenuItem key={gateway.G_id} value={gateway.gateway_name}>
                  {gateway.gateway_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display="flex" gap={2} mb={3} mt={3} alignItems="center">
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} format="YYYY-MM-DD" />
            <DatePicker label="End Date" value={endDate} onChange={setEndDate} format="YYYY-MM-DD" />
            <Button variant="contained" onClick={fetchEnergySummary}>
              Fetch Data
            </Button>
          </Box>
        </Box>

        {/* Checkboxes */}
        <FormGroup row sx={{ mb: 2 }}>
          <FormControlLabel control={<Checkbox checked={showGrid} onChange={() => setShowGrid(!showGrid)} />} label="Show Grid" />
          <FormControlLabel control={<Checkbox checked={showGridNegative} onChange={() => setShowGridNegative(!showGridNegative)} />} label="Show Grid EP-" />
          <FormControlLabel control={<Checkbox checked={showSolar} onChange={() => setShowSolar(!showSolar)} />} label="Show Solar" />
          <FormControlLabel control={<Checkbox checked={showGenerator} onChange={() => setShowGenerator(!showGenerator)} />} label="Show Generator" />
        </FormGroup>

        {/* View Mode Toggle and Download Button */}
        <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
 
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setViewMode(newValue);
              }
            }}
          >
            <ToggleButton value="table">Table</ToggleButton>
            <ToggleButton value="graph">Graph</ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="outlined"
            onClick={downloadCSV}
            disabled={energyData.length === 0}
            sx={{ height:50 }}
          >
            Download CSV
          </Button>
        </Box>

        {/* Table or Graph View */}
        {energyData.length > 0 && viewMode === 'table' && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  {showGrid && <TableCell>Grid EP+</TableCell>}
                  {showGridNegative && <TableCell>Grid EP-</TableCell>}
                  {showSolar && <TableCell>Solar EP+</TableCell>}
                  {showGenerator && <TableCell>Generator EP+</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {energyData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    {showGrid && <TableCell>{row["Grid_EP+"] ?? 0}</TableCell>}
                    {showGridNegative && <TableCell>{row["Grid_EP-"] ?? 0}</TableCell>}
                    {showSolar && <TableCell>{row["Solar_EP+"] ?? 0}</TableCell>}
                    {showGenerator && <TableCell>{row["Generator_EP+"] ?? 0}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {energyData.length > 0 && viewMode === 'graph' && (
          <Box mt={2}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectGatewayDropdowns;
