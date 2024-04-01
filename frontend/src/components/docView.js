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
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 }); 
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [resizableHeight, setResizableHeight] = useState(50);
  const [resizableWidth, setResizableWidth] = useState(100);
  const [signatures, setSignatures] = useState([]);
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
      height: size.height,
      width: size.width 
    };

    //console.log("Updated Height:", size.height, "Width:", size.width);
    setSignatures(updatedSignatures);
  };

  const addSignature = () => {
    setSignatures([...signatures, { id: Date.now(), x: 100, y: 100, height: 200, width: 200}]);
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
    

    for (const signature of signatures) {
      
      const formData = new FormData();
      console.log(uploadedFile)
      formData.append('document', uploadedFile);
      formData.append('signature_image', uploadedSignature);
      formData.append('pageNum', pageNumber - 1);
      formData.append('x_cord', signature.x);
      formData.append('y_cord', signature.y+22);
      formData.append('image_height', signature.height);
      formData.append('image_width', signature.width);
  
      const response = await fetch("textImage/addImage/", {
        method: "POST",
        body: formData,
      });
      
	    const modified = await response.blob();

      const modifiedFile = new File([modified], 'modified_file.pdf', { type: 'application/pdf', lastModified: Date.now() });
      setUploadedFile(modifiedFile);
    
    }
	
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
            <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
              Previous Page
            </button>
            <div ref={parentDivRef} style={{position: "relative", width: "615px", height: "900px", overflow: "visible" }}>
            <div style={{ position: "absolute", zIndex: 1 }}>
              
            {signatures.map((signature, index) => (
                    <Draggable handle="strong" key={signature.id}
                      onDrag={(e, ui) => handleDrag(index, e, ui)}
                      position={{ x: signature.x, y: signature.y }} 
                      bounds={{
                        top: 0,
                        left: 0,
                        right: 615-signature.width, 
                        bottom: 800
                      }}
                      >
                      <div className="box no-cursor" >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong className="cursor" ><div style={{ border: '1px solid black', backgroundColor: 'white' }}>Click Here And Drag</div></strong>
                        <button onClick={() => deleteSignature(signature.id)}>Delete</button>
                        </div>
                        <ResizableBox className="box" width={200} height={200} onResize={(event, { size }) => onResize(index, event, { size })} resizeHandles={['sw', 'se', 's', 'e', 'w']}
			                  >
                          <div style={{ width: '100%', height: '100%', border: '1px solid black' }}>
				                  <img src={uploadedSignature} alt="Uploaded Signature" style={{ width: "100%", height: "100%" }} />
                          </div>
                        </ResizableBox>                        
                      </div>
                    </Draggable>
                  ))}

                
            </div>
            
              <Document file={uploadedFile} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={613} height={700} renderTextLayer={false} />
              </Document>
            </div>
            <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              Next Page
            </button>
            <div>
              {<button onClick={addSignature}>Add Signature</button>}
              <button onClick={applyChange}>Apply Changes</button>
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