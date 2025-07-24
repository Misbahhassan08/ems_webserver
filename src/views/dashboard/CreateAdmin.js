import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import urls from '../../urls/urls';

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPhoneValid = (phone) => /^[0-9]{4}-[0-9]{7}$/.test(phone);

const CreateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const userData = location.state?.userData || {};
  const receivedUser = userData?.user || {};
  const loggedInAdminId = userData?.user_id;
  const isEditMode = receivedUser?.id !== undefined;
  const userId = receivedUser?.id;

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    role: 'admin',
    zip_code: '',
    adress: '',
    image: '',
    is_online: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  //const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        firstname: receivedUser.firstname || '',
        lastname: receivedUser.lastname || '',
        email: receivedUser.email || '',
        contact: receivedUser.contact || '',
        password: '',
        role: receivedUser.role || 'admin',
        zip_code: receivedUser.zip_code || '',
        adress: receivedUser.address || '',
        image: receivedUser.image || '',
        is_online: receivedUser.is_online || false,
      });
      setSelectedImage(receivedUser.image);
    }
  }, [location.state]);

  // useEffect(() => {
  //   const fetchUnassignedUsers = async () => {
  //     try {
  //       const response = await axios.get(urls.unassignedUsers);
  //       setUnassignedUsers(response.data?.unassigned_users || []);
  //     } catch (err) {
  //       console.error('Failed to fetch unassigned users', err);
  //       setUnassignedUsers([]);
  //     }
  //   };
  //   fetchUnassignedUsers();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contact') {
      let cleaned = value.replace(/[^\d]/g, '');
      if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
      if (cleaned.length > 4) {
        cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
      }
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setSelectedImage(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    if (!formData.firstname) newErrors.firstname = 'First name is required';
    if (!formData.lastname) newErrors.lastname = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contact) newErrors.contact = 'Phone number is required';
    if (!formData.password && !isEditMode) newErrors.password = 'Password is required';
    if (!isEmailValid(formData.email)) newErrors.email = 'Invalid email format';
    if (!isPhoneValid(formData.contact)) newErrors.contact = 'Invalid phone number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        const timestamp = new Date().getTime();
        const randomNumber = Math.floor(Math.random() * 10000);
        const uniqueFilename = `image_${timestamp}_${randomNumber}.png`;

        const uploadForm = new FormData();
        uploadForm.append('image', selectedFile, uniqueFilename);

        const uploadResponse = await axios.post('https://mexemai.com/bucket/update/ems', uploadForm);
        imageUrl = uploadResponse.data.image_url;
      }

      const payload = {
        ...formData,
        image: imageUrl,
        password: isEditMode ? undefined : formData.password,
        created_by: loggedInAdminId, // ✅ Set creator
      };

      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined && v !== '')
      );

      const apiUrl = isEditMode ? urls.updateUser(userId) : urls.createUser;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedPayload),
      });

      const responseData = await response.json();

      const createdAdminId =
        responseData?.user?.user_id || responseData?.user_id || responseData?.id;

      if (selectedUserId && createdAdminId) {
        try {
          await axios.post(urls.assignUserToAdmin, {
            admin_id: createdAdminId,
            user_id: selectedUserId,
          });
          toast.success('User assigned to Admin successfully');
        } catch (err) {
          console.error('Assign error:', err);
          toast.error('Failed to assign user to admin');
        }
      }

      alert(isEditMode ? 'Admin updated successfully' : 'Admin created successfully');
      navigate('/dashboard/manageAdmin');
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {isEditMode ? 'Edit Admin' : 'Create Admin'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <TextField name="firstname" label="First Name *" value={formData.firstname} onChange={handleChange} fullWidth sx={{ mb: 2 }} error={!!errors.firstname} helperText={errors.firstname} />
          <TextField name="lastname" label="Last Name *" value={formData.lastname} onChange={handleChange} fullWidth sx={{ mb: 2 }} error={!!errors.lastname} helperText={errors.lastname} />
          <TextField name="email" label="Email *" value={formData.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} error={!!errors.email} helperText={errors.email} />
          <TextField name="contact" label="Phone Number *" value={formData.contact} onChange={handleChange} fullWidth sx={{ mb: 2 }} error={!!errors.contact} helperText={errors.contact} />
          <TextField name="adress" label="Address" value={formData.adress} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField name="zip_code" label="Zip Code" value={formData.zip_code} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          {!isEditMode && (
            <TextField name="password" label="Password *" type="password" value={formData.password} onChange={handleChange} fullWidth sx={{ mb: 2 }} error={!!errors.password} helperText={errors.password} />
          )}

          <Button variant="contained" onClick={handleSubmit} fullWidth disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Admin' : 'Create Admin'}
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          {selectedImage || formData.image ? (
            <img src={selectedImage || formData.image} alt="Uploaded" style={{ width: '100%', borderRadius: 8 }} />
          ) : (
            <Box sx={{ width: '100%', height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, border: '2px dashed #ccc' }}>
              <Typography>No Image Selected</Typography>
            </Box>
          )}
          <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
            Upload Image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateUser;
