import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "@material-ui/core/Button";
import { useLocation } from "react-router-dom";
import Draggable, {DraggableCore} from 'react-draggable';
import { Resizable, ResizableBox } from "react-resizable";
import SignatureCanvas from 'react-signature-canvas'
import "./resize.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function DocView() {
  const location = useLocation();
  const [uploadedFile, setUploadedFile] = useState();
  const [uploadedSignature, setUploadedSignature] = useState();
  const [numPages, setNumPages] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [texts, setText] = useState([]);
  const [popupText, setPopupText] = useState('');
  const parentDivRef = React.useRef(null);
  

  useEffect(() => {
    if (location.state) {
      setUploadedFile(location.state.uploadedFile);
    }
  }, [location.state]);



  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
    event.preventDefault();
    var popup = document.getElementById('myPopupSig');
    popup.classList.toggle('show');
    const signatureImage = uploadedSignature.getTrimmedCanvas().toDataURL('image/png');
    console.log(signatureImage)
    setSignatures([...signatures, { id: Date.now(), image: signatureImage, x: 100, y: 100, height: 40, width: 145}]);
  };

  const addExistingSignature = () => {
    var popup = document.getElementById('myPopupOptSig');
    popup.classList.toggle('show');
    const signatureImage = uploadedSignature.getTrimmedCanvas().toDataURL('image/png');
    setSignatures([...signatures, { id: Date.now(), image: signatureImage, x: 100, y: 100, height: 40, width: 145}]);
  };

  const changeFontSize = (id, add) => {
    const updatedTexts = texts.map((text) => {
      if (text.id === id) {
        //console.log(text.fontSize)
        return { ...text, fontSize: add ? text.fontSize + 1 : text.fontSize - 1 };
      }
      return text;
    });
    setText(updatedTexts);
  };

  const deleteSignature = (id) => {
    setSignatures(signatures.filter((signature) => signature.id !== id));
  };
  const deleteText = (id) => {
    setText(texts.filter((texts) => texts.id !== id));
  };

  const handleDrag = (index, e, ui) => {
    const { x, y } = ui;
    //console.log("New coordinates:", { x, y });
    const updatedSignatures = [...signatures];
    updatedSignatures[index] = { ...updatedSignatures[index], x, y };
    setSignatures(updatedSignatures);
  };

  const handleDragT = (index, e, ui) => {
    const { x, y } = ui;
    //console.log("New coordinates:", { x, y });
    const updatedText = [...texts];
    updatedText[index] = { ...updatedText[index], x, y };
    setText(updatedText);
  };

  const pop=() =>{
    var popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
  };

  const popSig=() =>{
    var popup = document.getElementById('myPopupOptSig');
    popup.classList.toggle('show');
    var popup = document.getElementById('myPopupSig');
    popup.classList.toggle('show');
  };

  const popOptSig=() =>{
    var popup = document.getElementById('myPopupOptSig');
    popup.classList.toggle('show');
  };

  const clearOptSig=() =>{
    var popup = document.getElementById('myPopupOptSig');
    popup.classList.toggle('show');
  }

  const cancelCanvas=() =>{
    uploadedSignature.clear()
    var popup = document.getElementById('myPopupSig');
    popup.classList.toggle('show');
  }

  const cancelText=() =>{
    var popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
  }


  const handlePopupTextChange = (event) => {
    setPopupText(event.target.value);
  };

  const addText = () => {
    event.preventDefault();
    var popup = document.getElementById('myPopup');
    popup.classList.toggle('show');
    console.log(popupText)
    setText([...texts, { id: Date.now(), content: popupText, x: 110, y: 100, fontSize: 12}]);
  }

  const handleClear = () => {
    uploadedSignature.clear()
  };

  const downloadFile = () => {
    const url = URL.createObjectURL(uploadedFile);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'uploaded_file.pdf');
    document.body.appendChild(link);
    link.click();
  };

const applyChange = async () => {
  try {    
    
    let curr = uploadedFile
    for (const signature of signatures) {
      let page_number = Math.floor(signature.y / 850);
      
      const formData = new FormData();
      //console.log(curr)
      //console.log(signature.x)
      //console.log((signature.y%850))
      formData.append('document', curr);
      formData.append('signature_image', signature.image);
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

    for (const text of texts) {
      let page_number = Math.floor(text.y / 850);
      let y_calc = Math.floor(((4/5)*text.fontSize)+25)
      const formData = new FormData();
      console.log(y_calc)
      formData.append('document', curr);
      formData.append('text', text.content);
      formData.append('pageNum', page_number);
      formData.append('x_cord', text.x+2);
      formData.append('y_cord', (text.y%850)+y_calc);
      formData.append('font_size',text.fontSize-1)
  
      const response = await fetch("textImage/addText/", {
        method: "POST",
        body: formData,
      });
      

	    const modified = await response.blob();

      const modifiedFile = new File([modified], 'modified_file.pdf', { type: 'application/pdf', lastModified: Date.now() });
      curr = modifiedFile
    
    }


    setUploadedFile(curr);
    console.log("Changes applied successfully.");
    setSignatures([]);
    setText([]);
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
				                  <img src={signature.image} alt="Uploaded Signature" style={{ width: "100%", height: "100%" }} />
                          </div>
                        </ResizableBox>                        
                      </div>
                    </Draggable>
                    
                  ))}

                
            </div>
            <div style={{ position: "absolute", zIndex: 2 }}>

            {texts.map((texts, index) => (
              
              <Draggable handle="strong" key={texts.id}
                onDrag={(e, ui) => handleDragT(index, e, ui)}
                position={{ x: texts.x, y: texts.y }} 
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
                  <button onClick={() => deleteText(texts.id)}>Delete</button>
                  </div>
                  <div style={{ border: '1px solid #000000', display: 'flex', fontSize: `${texts.fontSize}px`}}>{texts.content}</div>      
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button onClick={() => changeFontSize(texts.id, true)}>+</button>
                  <button onClick={() => changeFontSize(texts.id, false)}>-</button>
                  </div>      
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
              {<Button onClick={popOptSig}>Add Signature</Button>}                                     
              <Button onClick={applyChange}>Apply Changes</Button>
              <Button onClick={pop}>Add Text</Button>
              <Button onClick={downloadFile}>Download</Button>
             </div>
              
              

            <div className="popupSig" >
            <div className="popupOptSig">
                <div className="popuptext" id = "myPopupOptSig">
                <Button onClick={popSig}>New Signature</Button>
                {uploadedSignature && <Button onClick={addExistingSignature}>Use Current Signature</Button>}
                <Button onClick={clearOptSig}>Cancel</Button>
                </div>
              </div>
              <div className="popupCanvas" id="myPopupSig" style={{width: 300, height: 90, border:"2px solid black"}}>
                <div style={{width: 300, height: 70, border:"2px solid black"}}>
                <SignatureCanvas
                canvasProps={{width: 300, height: 70, className: 'sigCanvas'}}
                ref = {data =>setUploadedSignature(data)}
                
              />
              </div>
               <Button onClick={addSignature}>Save</Button>
               <Button onClick={handleClear}>Clear</Button>
               <Button onClick={cancelCanvas}>Cancel</Button>
              </div>
                  <div className="popup" >
                    <span className="popuptext" id="myPopup">
                      Enter Text Here: <input type="text" onChange={handlePopupTextChange} />
                      <Button onClick={addText}>Save</Button>
                      <Button onClick={cancelText}>Cancel</Button>
                    </span>
                  </div>
                
                
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