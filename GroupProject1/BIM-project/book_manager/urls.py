"""
URL configuration for PC_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    #path("admin/", admin.site.urls),  
    
    # Book listing
    path("list", book_list, name="book_list"),                           # Get all books
    path("list/title", book_list_title, name="book_list_title"),         # Get books sorted by title alphabetically
    path("list/price+", book_list_price_i, name="book_list_price_i"),    # Get books sorted by price (ascending)
    path("list/price-", book_list_price_d, name="book_list_price_d"),    # Get books sorted by price (descending)
    path("get-books",get_books,name = "books"),                          # Alternative API endpoint to get all books
    
    # Book creation
    path("add/", addbook, name="add"),                                   # Add a single book (with Google Books API auto-completion)
    path('adds/', addbook_mult, name='add_books'),                       # Bulk add multiple books from JSON
    
    # Book deletion
    path("d/n/<str:d_name>", del_book_name, name="del_book_name"),                         # Delete book by title
    path("d/a/<str:d_author>", del_book_author, name="del_book_author"),                   # Delete book by author
    path("d/n/<str:d_name>/<int:d_num>/", del_book_name_m, name="del_book_name_m"),        # Delete specific book by title and position
    path("d/a/<str:d_author>/<int:d_num>/", del_book_author_m, name="del_book_author_m"),  # Delete specific book by author and position
    path("dels/", del_mult, name="del_mult"),                                              # Delete multiple books by title list or ID list
    
    # Book filtering and updating
    path("filter/", ac_filter, name="ac_filter"),                                          # Filter books by title, author, or price
    path("up/<int:u_id>/", update_book_data, name="update_book_data"),                     # Update book details by ID
    
    # Google Books API integration
    path("multiple/<int:number>/",add_multiple_books,name="add-from-api"),                 # Add multiple books from Google Books API by search query
    

    # path("home", home, name="home"),
    # path("save", save_book_data, name="save_book_data"),
    # path("author", author_input, name="author_input"),
]
