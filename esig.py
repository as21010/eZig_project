import fitz
from PIL import Image



def edit_image_doc(in_file, out_file, inimage, Numpage, x_cord, y_cord):
    
    doc = fitz.open(in_file) 
    page = doc[Numpage]
    
    # Open the image
    with Image.open(inimage) as image:

        # Get the width of the image
        imwidth = image.width
        imheight = image.height

    image_path = inimage
    rect = fitz.Rect(x_cord, y_cord, x_cord+imwidth, y_cord+imheight)  

    # Insert the image with optional rotation
    page.insert_image(rect, filename=image_path)  

    if in_file == out_file:
        doc.saveIncr()  # Use incremental saving for original file
    else:
        doc.save(out_file)  # Use regular saving for new file


def edit_text_doc(in_file, out_file, intext, Numpage, x_cord, y_cord):
    doc = fitz.open(in_file) 
    page = doc[Numpage]
    p = fitz.Point(x_cord, y_cord)  # start point of 1st line

    text = intext

    rc = page.insert_text(p,  
                        text,  # the text (honors '\n')
                        fontname = "helv",  
                        fontsize = 11,  
                        rotate = 0,  
                        )

    if in_file == out_file:
        doc.saveIncr()  # Use incremental saving for original file
    else:
        doc.save(out_file)  # Use regular saving for new file

edit_text_doc('samplePage.pdf', 'annotated_pdf.pdf','Ashwin Subbu', 1, 75, 442)
edit_text_doc('annotated_pdf.pdf', 'annotated_pdf.pdf','3/16/2024', 1, 405, 442)
edit_image_doc('annotated_pdf.pdf','annotated_pdf.pdf', 'check.png', 0, 65, 470)
edit_image_doc('annotated_pdf.pdf','annotated_pdf.pdf', 'check.png', 0, 65, 520)
edit_image_doc('annotated_pdf.pdf','annotated_pdf.pdf', 'check.png', 0, 65, 587)
edit_image_doc('annotated_pdf.pdf','annotated_pdf.pdf', 'check.png', 0, 65, 623)
edit_image_doc('annotated_pdf.pdf','annotated_pdf.pdf', 'check.png', 0, 65, 687)

