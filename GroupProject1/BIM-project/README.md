# Book Inventory Management (BIM)


## Project Overview
"Readers Haven" is a local bookstore that has been operating traditionally for the past 30 years. To stay competitive with online platforms, the owner, Mrs. Smith, has decided to digitize the inventory system. The new system enables efficient book management, allowing for adding, updating, deleting, filtering, and sorting books seamlessly.

## Technical Requirements:
To run the BIM system, please ensure that your system meets the following requirements:

- Operating System: Windows, macOS, or Linux
- Docker

## Libraries Used:

- Python Django
- Python Programming language

## Installation Guidline

- Please install Docker 
- Clone this BIM repository

## Run the docker image

Once Docker is installed, build the docker image 
```bash
   docker build -t "your-image-name" .
 ```
Then, run the container
```bash
   docker run -p 8000:8000 "your-image-name"
```
Alternatively, if there is a docker-compose.yml file, 
you can build and start all services with a single command:
```bash
   docker compose up --build
 ```

Once the container is up, apply migrations and create a supersuer in terminal 

```bash
   docker-compose exec web python manage.py migrate
   docker-compose exec web python manage.py createsuperuser
```

Access the application at ``` `http://127.0.0.1:8000/` ```

To stop the continer press Ctrl+C


## Features Implemented
### 1. Adding Books
- Add a single book: `/add/?(title&author&date&price)=***`
- Add multiple books: `/adds/books=[<list>]`

### 2. Retrieving Book List
- Get the complete list of books: `/list/`
- Sort books by title: `/list/title`
- Sort books by price (ascending): `/list/price+`
- Sort books by price (descending): `/list/price-`

### 3. Deleting Books
- Delete a book by title: `/d/n/title(/sequence number)`
- Delete a book by author: `/d/n/author(/sequence number)`
- Delete books by ID or title (supports multiple deletions): `/dels/?(id&name)=***`

### 4. Filtering Books
- Filter books by partial or full attributes (title, author, price): `/filter/?(title&author&price)=***`

### 5. Updating Book Details
- Modify book details: `/up/<id>/?(title&author&date&price)=***`

### 6. API Integration
- Integrated **Google Books API** to facilitate bulk book imports and auto-complete book information.

## Database
The system uses Django's default database to store book information.


## Future Enhancements
- Implement user authentication for security.
- Add analytics to track book sales and trends.

