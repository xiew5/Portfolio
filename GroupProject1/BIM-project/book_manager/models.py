from django.db import models

# Create your models here.
class BookData(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    date = models.DateField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    
    def __str__(self):
        return self.title

