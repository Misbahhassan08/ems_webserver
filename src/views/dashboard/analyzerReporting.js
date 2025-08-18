import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MenuItem, Select, FormControl, InputLabel, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, FormGroup, FormControlLabel, ToggleButtonGroup, ToggleButton, Button
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
  const [analyzers, setAnalyzers] = useState([]);
  const [selectedAnalyzerId, setSelectedAnalyzerId] = useState('');
  const [analyzerMetadata, setAnalyzerMetadata] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [view, setView] = useState('table');

  useEffect(() => {
    axios
      .get(urls.getUserProjects())
      .then((res) => {
        if (res.data.project_managers) {
          setProjects(res.data.project_managers);
        }
      })
      .catch((err) => console.error('Error fetching project managers:', err));
  }, [userId]);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    const project = projects.find((p) => p.PM_id === projectId);
    if (project) {
      setGateways(project.connected_gateways || []);
      setSelectedGatewayName('');
      setAnalyzers([]);
      setSelectedAnalyzerId('');
      setAnalyzerMetadata([]);
      setSelectedKeys([]);
    }
  };

  const handleGatewayChange = (e) => {
    const gatewayName = e.target.value;
    setSelectedGatewayName(gatewayName);
    const gateway = gateways.find((g) => g.gateway_name === gatewayName);
    setAnalyzers(gateway?.analyzers || []);
    setSelectedAnalyzerId('');
    setAnalyzerMetadata([]);
    setSelectedKeys([]);
  };

  const handleAnalyzerChange = (e) => {
    const analyzerId = e.target.value;
    setSelectedAnalyzerId(analyzerId);
    setAnalyzerMetadata([]);
    setSelectedKeys([]);
  };

  const fetchAnalyzerMetadata = () => {
    if (!selectedAnalyzerId || !startDate || !endDate) return;
    axios.get(urls.analyzerdata, {
      params: {
        analyzer_id: selectedAnalyzerId,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
      },
    }).then((res) => {
      setAnalyzerMetadata(res.data.metadata || []);
    }).catch((err) => {
      console.error('Error fetching analyzer metadata:', err);
    });
  };

  const allKeys = Array.from(
    new Set(analyzerMetadata.flatMap((meta) => Object.keys(meta.values)))
  );

  const handleCheckboxToggle = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const downloadCSV = () => {
    if (!analyzerMetadata.length || !selectedKeys.length) return;

    const headers = ['Date & Time', ...selectedKeys];
    const csvRows = [headers.join(',')];

    analyzerMetadata.forEach((meta) => {
      const row = [
        dayjs(meta.timestamp).format('YYYY-MM-DD HH:mm:ss'),
        ...selectedKeys.map((key) => meta.values[key] ?? '-')
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyzer_data_${selectedAnalyzerId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartOptions = {
    title: { text: 'Analyzer Data Graph' },
    xAxis: {
      categories: analyzerMetadata.map(meta =>
        dayjs(meta.timestamp).format('YYYY-MM-DD HH:mm:ss')
      ),
      title: { text: 'Date & Time' }
    },
    yAxis: {
      title: { text: 'Value' }
    },
    series: selectedKeys.map((key) => ({
      name: key,
      data: analyzerMetadata.map((meta) => parseFloat(meta.values[key]) || 0)
    }))
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <Box display="flex" gap={2} mb={3}>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Project</InputLabel>
            <Select value={selectedProjectId} onChange={handleProjectChange}>
              {projects.map((p) => <MenuItem key={p.PM_id} value={p.PM_id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }} disabled={!gateways.length}>
            <InputLabel>Gateway</InputLabel>
            <Select value={selectedGatewayName} onChange={handleGatewayChange}>
              {gateways.map((g) => <MenuItem key={g.G_id} value={g.gateway_name}>{g.gateway_name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200 }} disabled={!analyzers.length}>
            <InputLabel>Analyzer</InputLabel>
            <Select value={selectedAnalyzerId} onChange={handleAnalyzerChange}>
              {analyzers.map((a) => <MenuItem key={a.analyzer_id} value={a.analyzer_id}>{a.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Box display="flex" gap={2} mb={2}>
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} format="YYYY-MM-DD" />
            <DatePicker label="End Date" value={endDate} onChange={setEndDate} format="YYYY-MM-DD" />
            <Button variant="contained" onClick={fetchAnalyzerMetadata}>Fetch Data</Button>
          </Box>
        </Box>

        {allKeys.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <FormGroup row>
              {allKeys.map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={selectedKeys.includes(key)}
                      onChange={() => handleCheckboxToggle(key)}
                    />
                  }
                  label={key}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        <Box mb={3} display="flex" justifyContent="flex-end">
          <ToggleButtonGroup value={view} exclusive onChange={(e, v) => v && setView(v)}>
            <ToggleButton value="table">Table</ToggleButton>
            <ToggleButton value="graph">Graph</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            onClick={downloadCSV}
            disabled={analyzerMetadata.length === 0 || selectedKeys.length === 0}
          >
            Download CSV
          </Button>
        </Box>

        {view === 'table' && analyzerMetadata.length > 0 && selectedKeys.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  {selectedKeys.map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {analyzerMetadata.map((meta, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{dayjs(meta.timestamp).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                    {selectedKeys.map((key) => (
                      <TableCell key={key}>{meta.values[key] ?? '-'}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {view === 'graph' && analyzerMetadata.length > 0 && selectedKeys.length > 0 && (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectGatewayDropdowns;
