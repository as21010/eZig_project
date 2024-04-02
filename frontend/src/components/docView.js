import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";
import Draggable, {DraggableCore} from 'react-draggable';
import { Resizable, ResizableBox } from "react-resizable";
import "./resize.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function DocView() {
  const location = useLocation();
  const [uploadedFile, setUploadedFile] = useState();
  const [uploadedSignature, setUploadedSignature] = useState();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 100, height: 50 }); 
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [resizableHeight, setResizableHeight] = useState(50);
  const [resizableWidth, setResizableWidth] = useState(100);
  const [signatures, setSignatures] = useState([]);
  const [texts, setText] = useState([]);
  const parentDivRef = React.useRef(null);

  useEffect(() => {
    if (location.state) {
      setUploadedFile(location.state.uploadedFile);
      setUploadedSignature(location.state.uploadedSignature);
    }
  }, [location.state]);



  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setPageNumber(Math.max(pageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(Math.min(pageNumber + 1, numPages));
  };

  const onResize = (index, event, { size }) => {
    const updatedSignatures = [...signatures];
    updatedSignatures[index] = {
      ...updatedSignatures[index],
      height: Math.round(size.height),
      width: Math.round(size.height * 3.125)
    };

    //console.log("Updated Height:", size.height, "Width:", size.width);
    setSignatures(updatedSignatures);
  };

  const addSignature = () => {
    
    setSignatures([...signatures, { id: Date.now(), x: 100, y: 100, height: 40, width: 145}]);
  };

  const deleteSignature = (id) => {
    setSignatures(signatures.filter((signature) => signature.id !== id));
  };

  const handleDrag = (index, e, ui) => {
    const { x, y } = ui;
    console.log("New coordinates:", { x, y });
    const updatedSignatures = [...signatures];
    updatedSignatures[index] = { ...updatedSignatures[index], x, y };
    setSignatures(updatedSignatures);
  };


const applyChange = async () => {
  try {    
    
    let curr = uploadedFile
    for (const signature of signatures) {
      let page_number = Math.floor(signature.y / 850);

      const formData = new FormData();
      console.log(curr)
      console.log(signature.x)
      console.log((signature.y%850))
      formData.append('document', curr);
      formData.append('signature_image', uploadedSignature);
      formData.append('pageNum', page_number);
      formData.append('x_cord', signature.x-15);
      formData.append('y_cord', (signature.y%850)+22);
      formData.append('image_height', signature.height);
      formData.append('image_width', signature.width);
  
      const response = await fetch("textImage/addImage/", {
        method: "POST",
        body: formData,
      });
      
	    const modified = await response.blob();

      const modifiedFile = new File([modified], 'modified_file.pdf', { type: 'application/pdf', lastModified: Date.now() });
      curr = modifiedFile
    
    }
    setUploadedFile(curr);
    console.log("Changes applied successfully.");
	
  } catch (error) {
    console.error("Error applying changes:", error);
  }
};




  return (
    <div>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        
        {uploadedFile && (
          
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div ref={parentDivRef} style={{position: "relative", width: "615px", height: "900px", overflowY: "auto"}}>
            <div style={{ position: "absolute", zIndex: 1 }}>
              
            {signatures.map((signature, index) => (
              
                    <Draggable handle="strong" key={signature.id}
                      onDrag={(e, ui) => handleDrag(index, e, ui)}
                      position={{ x: signature.x, y: signature.y }} 
                      bounds={{
                        top: 0,
                        left: 0,
                        right: 576, 

                      }}
                      >
                      <div className="box no-cursor" style={{
                      position: "absolute"}}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong className="cursor" ><div style={{ border: '1px solid black', backgroundColor: 'white', width: '150px', height: '20px' }}>Click Here And Drag</div></strong>
                        <button onClick={() => deleteSignature(signature.id)}>Delete</button>
                        </div>
                        <ResizableBox className="box" width={115} height={40} onResize={(event, { size }) => onResize(index, event, { size })} resizeHandles={['sw', 'se', 's', 'e', 'w']
                        } lockAspectRatio = {true}
			                  >
                          <div style={{ width: '100%', height: '100%', border: '1px solid black' }}>
				                  <img src={uploadedSignature} alt="Uploaded Signature" style={{ width: "100%", height: "100%" }} />
                          </div>
                        </ResizableBox>                        
                      </div>
                    </Draggable>
                    
                  ))}

                
            </div>
            
            <Document file={uploadedFile} onLoadSuccess={onDocumentLoadSuccess} pageLayout="continuous">
              {Array.from(new Array(numPages), (x, index) => (
                <div key={`page_${index + 1}`} style={{ position: "relative", width: "615px", maxHeight: '850px', overflow: "hidden"}}>
                  <Page pageNumber={index + 1} width={613} renderTextLayer={false} />
                </div>
              ))}
            </Document>
            </div>
            <div>
              {<button onClick={addSignature}>Add Signature</button>}
              <button onClick={applyChange}>Apply Changes</button>
              <button >Add Text</button>
            </div>     
          </div>
        )}
        {!uploadedFile && <p>No PDF file received.</p>}
      </Grid>
    </Grid>
  </div>
  );
}

export default DocView;