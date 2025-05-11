FROM python:3.11
WORKDIR /app
COPY . /app/
#dependencies
RUN pip install -r requirements.txt
RUN mkdir -p /app/staticfiles
RUN python manage.py collectstatic --noinput
# The port Django runs on
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


