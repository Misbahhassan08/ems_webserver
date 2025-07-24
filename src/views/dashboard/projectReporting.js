import React, { useState } from 'react';
import refresh from '../../assets/images/refresh.svg';
import {
  Typography,
  Box,
  Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';

function ReportingDropdown() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleTableData = (dataFromChild) => {
    setData(dataFromChild);
  };

  const handleSelectChange = (e) => {
  const selected = e.target.value;
  setSelectedOption(selected);

  if (selected === 'pergateway') {
    navigate('/dashboard/pergateway');
  } else if (selected === 'analyzerReporting') {
    navigate('/dashboard/analyzerReporting');
  }
};


  return (
    <Box padding={5}>
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2,
            background: 'linear-gradient(135deg, rgb(103, 182, 247), rgb(50, 120, 185))',
            padding: '10px',
            borderRadius: '8px',
            height: 'auto',
          }}
        >
          <Typography variant="h5" color="white" textAlign="center">
            Choose the Reporting
          </Typography>

          <select
            value={selectedOption}
            onChange={handleSelectChange}
            style={{
              padding: '8px',
              backgroundColor: '#2291e6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              marginBottom: '5px',
            }}
          >
             <option value="select reporting">Select Reporting</option>

           <option value="pergateway">Per Gateway</option>
          <option value="analyzerReporting">Analyzer Reporting</option>
          </select>
        </Box>
      </Box>
    </Box>
  );
}

export default ReportingDropdown;
