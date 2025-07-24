import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Typography, Box, Paper } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import frame from "../.././../assets/images/emslogo.svg";
import loginimg from "../.././../assets/images/image5.svg";
import urls from "../../../urls/urls";
import { InputAdornment } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from '../../../Context/AuthContext';
import { Bold, FileX } from "lucide-react";
import { right } from "@popperjs/core";
import backgroundimage from "../.././../assets/images/Rectangle50.svg";
import icon from "../.././../assets/images/Group444.svg";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(urls.loginUser, { email, password });
      const { success, user_id, firstname, lastname, role, image, unique_key, contact,
        adress,
        zip_code,
        access,
        refresh,
      } = response.data;
      console.log('Response data:', response.data)
      if (success) {
        setRole(role);
        login({
          user_id, firstname, lastname, role, image, unique_key, email, contact, adress, zip_code, access,
          refresh,
        });
        toast.success("Login successful!");
        // Navigation based on role
        if (role === "admin" || role === "user") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/SuperAdminDashboard");
        }
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Grid container component="main" sx={{ height: "100vh", bgcolor: "white" }}>
      <Grid
        item
        xs={12}
        sm={5}
        md={5}
        sx={{

          backgroundImage: `url(${backgroundimage})`,
          backgroundSize: "cover",         // This ensures the image covers the full area
          backgroundPosition: "center",    // Center the image
          backgroundRepeat: "no-repeat",   // Prevent repeating
          display: "flex",
          flexDirection: "column",
          
          alignItems: "center",
          textAlign: "center",
          padding: 3,
          position: "relative", // Required for pseudo-element
          overflow: "hidden", // Prevents shadow from affecting white border areas
          borderTopRightRadius: { md: "30px", xs: "0px" },
          borderBottomRightRadius: { md: "30px", xs: "30px" },
          borderBottomLeftRadius: { md: "0px", xs: "30px" },

          "&::after": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "inherit",
            top: 0,
            left: 0,
            zIndex: -1,
          },
        }}
      >

        {/* Image */}
        <Box
          component="img"
          src={icon}
          alt="Login Illustration"
          sx={{
            width: "60%",
            maxWidth: 200,
            objectFit: "contain",
            mt: "80px",
            
          }}
        />
      </Grid>
      {/* Right Side Form */}
      <Grid
        item
        xs={12}
        sm={7}
        md={7}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Nested Box with Gradient Border */}
        <Box
          sx={{
            width: "80%",
            maxWidth: 400,
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#fff",
            justifyItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              justifyContent: "center",
              p: 0,
              m: 0,
            }}
          >
            {/* Left - Image */}
            <Box
              component="img"
              src={loginimg}
              alt="Login Illustration"
              sx={{
                p: 0,
                display: "block",
                height: "auto",
                maxHeight: "250px", // Adjust this if needed
                mb: "100px"
              }}
            />
            {/* Middle - Vertical Line (same height as parent) */}
            <Box
              sx={{
                width: "2px",
                bgcolor: "#192C4D",
                p: 0,
                ml: "-70px",
                mt: "95px",
                maxHeight: "120px",
                mr: "60px"
              }}
            />
            {/* Right - Text Stack */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                m: 0,
                p: 0,
                mr: "70px",
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="#192C4D" sx={{ m: 0, p: 0 }}>
                INDUSTOMATION
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#192C4D" sx={{ m: 0, p: 0 }}>
                ENGINEERING
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="#192C4D" sx={{ m: 0, p: 0 }}>
                SOLUTION
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" color={"black"} gutterBottom textAlign={"center"}>
            Welcome <br />
            Login to Your Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Email Address"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              sx={{
                "& .MuiInput-underline:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:after": { borderBottomColor: "black" },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              sx={{
                "& .MuiInput-underline:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:after": { borderBottomColor: "black" },
              }}
            />
            <Typography fontWeight={"bold"} color={"blue"} textAlign={"right"} mt={2}>
              Forgot Password?
            </Typography>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                mb: 4,
                backgroundColor: "#0066FF",
                color: "#fff",
                "&:hover": { backgroundColor: "#0044CC" },
              }}
              disabled={loading}
            >
              {loading ? "Sigging in..." : "Sign in"}
            </Button>
          </form>
        </Box>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};
export default Login;







