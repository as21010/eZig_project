from django.shortcuts import render
import json
import shutil
from django.conf import settings
import os
from django.http import HttpResponse, JsonResponse
from .document_utils import edit_image_doc, edit_text_doc
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def say_hello(request):
    return HttpResponse('Hello World')



@csrf_exempt
def insert_image(request):
    if request.method == 'POST':
        

        inFile = request.FILES['document']
        inImage = request.POST.get('signature_image')
        numPage = int(request.POST.get('pageNum'))
        xCord = int(request.POST.get('x_cord'))
        yCord = int(request.POST.get('y_cord'))
        imgHeight = int(request.POST.get('image_height'))
        imgWidth = int(request.POST.get('image_width'))
        modified_filename = "modified_file.pdf"

  
        modified_file_path = os.path.join(settings.MEDIA_ROOT, modified_filename)
        with open(modified_file_path, 'wb') as modified_file:
            shutil.copyfileobj(inFile, modified_file)

        edit_image_doc(modified_file_path, modified_file_path, inImage, numPage, xCord, yCord, imgHeight, imgWidth)
    
        with open(modified_file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/pdf')
            return response
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def insert_text(request):
    if request.method == 'POST':
        inFile = request.FILES['document']
        inText = request.POST.get('text')
        numPage = int(request.POST.get('pageNum'))
        xCord = int(request.POST.get('x_cord'))
        yCord = int(request.POST.get('y_cord'))
        fontSize = int(request.POST.get('font_size'))
        modified_filename = "modified_file.pdf"

        modified_file_path = os.path.join(settings.MEDIA_ROOT, modified_filename)
        with open(modified_file_path, 'wb') as modified_file:
            shutil.copyfileobj(inFile, modified_file)
        
        edit_text_doc(modified_file_path, modified_file_path, inText, numPage, xCord, yCord, fontSize)
        print("worked")
        with open(modified_file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/pdf')
            return response
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)