import React, { useState, useEffect } from "react";
import SignatureCanvas from 'react-signature-canvas'
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { useNavigate } from 'react-router-dom';
import { Resizable, ResizableBox } from "react-resizable";



export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); 
  };

  const handleSubmit = () => {
    if (selectedFile) {
      navigate("/docView", { state: { uploadedFile: selectedFile}});
    } else {
      alert("Please select a PDF and sign");
    }
  };

  
    
    return (

      <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          E-ZIG SETUP
        </Typography>
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center"> Insert PDF Here:</div>
            </FormHelperText>
            <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} />
            </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit and View PDF
            </Button>
            </Grid>
            
      </Grid>
      
    );
  
}
