import fitz
from PIL import Image
import base64
import os



def edit_image_doc(in_file, out_file, inimage, Numpage, x_cord, y_cord, imgH, imgW):
    
    doc = fitz.open(in_file) 
    num_pages = len(doc)
    
    page = doc[Numpage]
    
    _, encoded_data = inimage.split(',', 1)
    image_data = base64.b64decode(encoded_data)
    
    image_path = 'temp_image.png'
    with open(image_path, 'wb') as f:
        f.write(image_data)

    

    rect = fitz.Rect(x_cord, y_cord, x_cord+imgW, y_cord+imgH)  

   
    page.insert_image(rect, filename=image_path)  
    os.remove(image_path)

    if in_file == out_file:
        doc.saveIncr() 
    else:
        doc.save(out_file)  


def edit_text_doc(in_file, out_file, intext, Numpage, x_cord, y_cord):
    doc = fitz.open(in_file) 
    page = doc[Numpage]
    p = fitz.Point(x_cord, y_cord) 

    text = intext

    rc = page.insert_text(p,  
                        text,  
                        fontname = "helv",  
                        fontsize = 11,  
                        rotate = 0,  
                        )

    if in_file == out_file:
        doc.saveIncr()  
    else:
        doc.save(out_file)  


