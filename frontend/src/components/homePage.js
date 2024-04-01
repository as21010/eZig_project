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
  const[sign, setSign] = useState();
  const[signImage, setSignImage] = useState(null);
  const navigate = useNavigate();
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); 
  };

  const handleSubmit = () => {
    if (selectedFile && signImage) {
      navigate("/docView", { state: { uploadedFile: selectedFile, uploadedSignature: signImage }});
    } else {
      alert("Please select a PDF and sign");
    }
  };

  const handleClear = () => {
    sign.clear()
  };
  
  const handleSave = () => {
    setSignImage(sign.getTrimmedCanvas().toDataURL('image/png'));
    
  }
  const ResizableBox = require('react-resizable').ResizableBox;
  
    
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
            <div>
              <div style={{border:"2px solid black"}}>
                <SignatureCanvas
                canvasProps={{width: 300, height: 70, className: 'sigCanvas'}}
                ref = {data =>setSign(data)}
              />
            </div>
            <Button onClick={handleClear}>
              Clear
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
            </div>
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
