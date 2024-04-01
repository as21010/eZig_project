from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.say_hello),
    path('addImage/', views.insert_image),
    path('addText/', views.insert_text)
    ]
