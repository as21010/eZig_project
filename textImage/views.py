from django.shortcuts import render
import json
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
        modified_filename = "modified_file"
        edit_image_doc(inFile, modified_filename, inImage, numPage, xCord, yCord, imgHeight, imgWidth)
    
        with open(modified_filename, 'rb') as f:
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
        modified_filename = f"modified_{inFile}"
        edit_text_doc(inFile, inFile, inText, numPage, xCord, yCord)
        print("worked")
        with open(inFile, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/pdf')
            return response
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)