from django.middleware.csrf import get_token
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render,redirect, get_object_or_404
from .models import BookData
from datetime import datetime
from rest_framework import serializers
import json
import requests
from rest_framework.decorators import api_view

# Create your views here.

# Error handler for 404 Not Found errors
def view_url404(request, exception):
    return JsonResponse({'Error':'Invalid URL'}, status=404)

# Get all books in the database
def book_list(request):
    try:
        allbook = list(BookData.objects.all().values("id","title", "author", "date", "price"))
        return JsonResponse(allbook, safe=False)
    except:
        return JsonResponse({'Error':'Please add the book first'}, status=404)
    
# Get books sorted by title
def book_list_title(request):
    try:
        allbook = list(BookData.objects.all().order_by('title').values("id","title", "author", "date", "price"))
        return JsonResponse(allbook, safe=False)
    except:
        return JsonResponse({'Error':'Please add the book first'}, status=404)
    
# Get books sorted by price (ascending)
def book_list_price_i(request):
    try:
        allbook = list(BookData.objects.all().order_by('price').values("id","title", "author", "date", "price"))
        return JsonResponse(allbook, safe=False)
    except:
        return JsonResponse({'Error':'Please add the book first'}, status=404)
    
# Get books sorted by price (descending)
def book_list_price_d(request):
    try:
        allbook = list(BookData.objects.all().order_by('-price').values("id","title", "author", "date", "price"))
        return JsonResponse(allbook, safe=False)
    except:
        return JsonResponse({'Error':'Please add the book first'}, status=404)

# Filter books by title, author, or price
def ac_filter(request):
    title_name = request.GET.get('title')
    author_name = request.GET.get('author')
    price_key = request.GET.get('price')

    ser_name = {}
    if title_name:
        ser_name['title__icontains'] = title_name
    if author_name:
        ser_name['author__icontains'] = author_name
    if price_key:
        ser_name['price__icontains'] = price_key

    if ser_name:
        book = BookData.objects.filter(**ser_name).values("title", "author", "date", "price")
        if book.exists():
                return JsonResponse(list(book), safe=False)
        else:
            return JsonResponse({'Error': 'Sorry, the book cannot be found'})
    else:   
        return JsonResponse({'Error':'Please enter correct type first'})

# Add a book with Google Books API auto-completion
def addbook(request):
    try:
        title = request.GET.get('title')
        author = request.GET.get('author')
        date = request.GET.get('date')
        price = request.GET.get('price')
        if title:
            api_key = 'AIzaSyDISPHaW492dwNOtdrdlekcZRZ_6-TaGhw'
            if author:
                url = f'https://www.googleapis.com/books/v1/volumes?q={title}+inauthor:{author}&key={api_key}'
            else:
                url = f'https://www.googleapis.com/books/v1/volumes?q={title}&key={api_key}'

            alldata = requests.get(url).json()

            # If no book found, use provided data or defaults
            if alldata['totalItems'] == 0:
                author = author if author else 'Unknown'
                date = date if date else None
                price = price if price else 0.00
            else:
                # Extract book data from Google API response
                book = alldata['items'][0]
                book_detail = book.get('volumeInfo', {})
                sale = book.get('saleInfo', {})

                title = book_detail.get('title', title)
                author = book_detail.get('authors', author)
                date = book_detail.get('publishedDate', date)
                if not date:
                    date = datetime(2001, 1, 1).date()
                price = sale.get('retailPrice', {}).get('amount', price)
                if not price:
                    price = 0.00
        
        # Handle different date formats
        if date:
            try:
                if len(date) == 4:
                    date = datetime.strptime(date, '%Y').date()
                elif len(date) == 7:
                    date = datetime.strptime(date, '%Y-%m').date()
                else:
                    date = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                date = datetime(2001, 1, 1).date()
        
        # Create and save book to database
        book = BookData(
            title=title,
            author=author,
            date=date,
            price=price
        )
        book.save()
        return redirect("/list")
    except Exception as e:
        return JsonResponse({'Error': f'Please enter correct detail.{e}'})
    
# Bulk add multiple books at once
def addbook_mult(request):
    try:
        mid = (request.GET.get('books'))
        books = json.loads(mid)
        all_books = [BookData(**book) for book in books]
        BookData.objects.bulk_create(all_books, batch_size=500)

        return JsonResponse({"message":f"You add {len(all_books)} books seccessfully"})
    except Exception as e:
        return JsonResponse({'Error':f'Please enter books.{e}'})

# Delete a book by title
def del_book_name(request, d_name):
    dbook = BookData.objects.filter(title = d_name)
    if dbook.exists():
        if dbook.count() == 1:
            dbook.delete()
            return redirect("/list")
        else:
            return JsonResponse({'Error': 'Sorry, there is more than one book that matches your request. Please add its sequence number to the URL to delete a specific one, like:/title/1.'})
    else:
        return JsonResponse({'Error': 'No books found with this title'})    

# Delete a book by author
def del_book_author(request, d_author):
    dbook = BookData.objects.filter(author = d_author)
    if dbook.exists():
        if dbook.count() == 1:
            dbook.delete()
            return redirect("/list")
        else:
            return JsonResponse({'Error': 'Sorry, there is more than one book that matches your request. Please add its sequence number to the URL to delete a specific one, like:/author/1.'})
    else:
        return JsonResponse({'Error': 'No books found with this author'})

# Delete a specific book by title and sequence
def del_book_name_m(request, d_name, d_num):
    dbook = list(BookData.objects.filter(title = d_name))
    if d_num > 0 and d_num <= len(dbook):
        tem_dbook = dbook[d_num - 1]
        tem_dbook.delete()
        return redirect("/list")
    else:
        return JsonResponse({'Error': "Sorry, the book you want to delete could not be found."})

# Delete a specific book by author and sequence
def del_book_author_m(request, d_author, d_num):
    dbook = list(BookData.objects.filter(author = d_author))
    if d_num > 0 and d_num <= len(dbook):
        tem_dbook = dbook[d_num - 1]
        tem_dbook.delete()
        return redirect("/list")
    else:
        return JsonResponse({'Error': 'Sorry, the book you want to delete could not be found.'})

# Delete multiple books by title list or ID list
def del_mult(request):
    d_names = request.GET.getlist('title')
    d_ids = request.GET.getlist('id')
    if d_names:
        BookData.objects.filter(title__in = d_names).delete()
    if d_ids:
        BookData.objects.filter(pk__in = d_ids).delete()
    if d_names or d_ids:
        return redirect("/list")
    else:
        return JsonResponse({'Error': 'Sorry, the book you want to delete could not be found.'})

# Update book details by ID
def update_book_data(request, u_id):
    u_name = request.GET.get('title')
    u_author = request.GET.get('author')
    u_date = request.GET.get('date')
    u_price = request.GET.get('price')
    
    book = get_object_or_404(BookData, pk=u_id)
    if u_name !=None:
        book.title = u_name
    if u_author !=None:
        book.author = u_author
    if u_date !=None:
        book.date = u_date
    if u_price !=None:
        book.price = u_price
    try:
        book.save()
    except:
        return JsonResponse({'Error': 'Sorry, please enter the correct data.'})

    return JsonResponse({'message': 'Book details updated successfully', 
                         'Updated book': {
                             'title': book.title,
                             'author': book.author,
                             'date': book.date,
                             'price': book.price
                        }
                    })

# Mario code section

# Serializer for BookData model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookData
        fields = "__all__"
        
# Get all books using DRF serializer
def get_books(request):
    books = BookData.objects.all()
    serializer = UserSerializer(books,many =True)
    return JsonResponse(serializer.data,safe=False)
   
# Get books sorted by specified option
def get_sorted_books(request,option,sort):
    #Sorting the title first
    
    try:
        # Experimental title sorting implementation
        all_books = BookData.objects.all()
        map = {}
        chars = [] 
        sorted_title = []
        for i in all_books:
            map[i.title[0]] = i.title
            chars.append(i.title[0])
            
        for j in sorted(map.keys()):
            sorted_title.append(map.get(j))         
        print(sorted_title)

        # Sorting implementation using Django ORM
        try:
            if str(option) == 'title':
                sorted_books = BookData.objects.all().order_by('title')
                serialized = UserSerializer(sorted_books,many=True)
                return JsonResponse(serialized.data,safe=False)
            elif str(option) == 'price': # Ascending order
                sorted_books = BookData.objects.all().order_by('price')
                serialized = UserSerializer(sorted_books,many=True)
                return JsonResponse(serialized.data,safe=False)
            elif str(option) == '-price': # Descending order
                sorted_books = BookData.objects.all().order_by('-price')
                serialized = UserSerializer(sorted_books,many=True)
                return JsonResponse(serialized.data,safe=False) 
            else:
                return JsonResponse({"Message:Invalid option selected"})
          
        except:
            JsonResponse({"Message:Invalid option selected"}) 
    
    except:
       return JsonResponse({"Message:Something went wrong with the request"}) 
   
    return JsonResponse({"Status:OK"})
    
# Add a single book with duplicate checking
def add_books(request,name,title,date,price):
    # Check for duplicate titles
    all_books = BookData.objects.all()
    list = []
    for i in all_books:
        list.append(i.title)
    if title in list:
        return False
    else:
        books = BookData()
        books.author = name
        books.title = title
        books.date = date
        books.price = price
        if books.author and books.title: # Validate required fields
            books.save()
            return True

# Add multiple books from Google Books API by search query
@api_view(['GET','POST'])
def add_multiple_books(request,number):
   
    query = request.GET.get('q', '')  # Get the search query from the URL
    api = requests.get(
        "https://www.googleapis.com/books/v1/volumes?/q={query}",
        params={'q':query,'maxResults':number}
    )
    
    all_data = api.json()
  
    # Lists to store book details
    book_title_list = []
    book_authors_list = []
    book_date_list = []
    book_price_list = []
    id_list = []
    
    print(len(all_data['items']))
    
    try:    
        # Extract book details from API response
        for i in range(number):
            
            book_item = all_data['items'][i]
            id = book_item['id'] # primary key
            book_title = book_item['volumeInfo']['title']
            if 'saleInfo' in book_item:
                book_price = book_item.get('saleInfo', {}).get('retailPrice', {}).get('amount', 0.00)
                book_price_list.append(book_price)
            else:
                print("sale info not found:")  
                book_price_list.append(0)
            if 'publishedDate' in book_item['volumeInfo']:
                book_date = book_item['volumeInfo']['publishedDate']
                book_date_list.append(book_date)
            else:
                book_date_list.append(None)
                print("Published date not found :")
                
            book_title_list.append(book_title)
            id_list.append(id)
        
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
    print(book_price_list)
   
    # Save retrieved books to database
    try:
        for i in range(number):
            result = add_books(request,"null",book_title_list[i],book_date_list[i],book_price_list[i])
            print(result)
        if result:
            return JsonResponse({"Message:Books added successfully"})
        else:
            return JsonResponse({"Message:Could not add the books"})
    except Exception as err:
        print(f"Unexpected storing data {err=}, {type(err)=}")   
        return JsonResponse({"Message:Could not add the books"})
    

# Adding books through a form
def save_book_data(request):
    book_name = request.POST.get('book_name')
    book_author = request.POST.get('book_author')
    book_date = request.POST.get('book_date')
    book_price = request.POST.get('book_price')

    book = BookData(
        name=book_name,
        author=book_author,
        date=book_date,
        price=book_price
    )
    book.save()

    return redirect('/home')

# Render the home page
def home(request):
   return render(request, "index.html", context={})

# def home(request):
#     csrf_token = get_token(request)
#     html_page = f"""
#     <html>
#     <body>
#     <h3>Please enter the massage of your book(Book name; Author; Date"2001-01-01"; price)</h3>
#     <form method = "POST" action = "/save">
#     <input type="hidden" name="csrfmiddlewaretoken" value="{csrf_token}">
#         <label>Name<label>
#         <input type = "text" name="book_name">
#
#         <label>Author<label>
#         <input type = "text" name="book_author">
#
#         <label>date<label>
#         <input type = "text" name="book_date">
#
#         <label>price<label>
#         <input type = "text" name="book_price">
#     <button type = "submit">next</button>
#
#     <a href="/list">BookList</a>
#     <a href="/author">SearchAuthor</a>
#     </body>
#     </html>
#     """
#     return HttpResponse(html_page)
