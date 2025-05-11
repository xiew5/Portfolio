from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from dateutil.relativedelta import relativedelta
from datetime import datetime
from django.db.models import Q, F, ExpressionWrapper, DurationField

class Habitat(models.Model):
    name = models.CharField(max_length=50, unique=True)
    size = models.CharField(max_length=100)
    climate = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name}"
    
    @classmethod
    def create(cls, name, size, climate):
        habitat = cls(
            name=name,
            size=size,
            climate=climate,
        )
        habitat.save()
        return habitat

class Animal(models.Model):
    species = models.CharField(max_length=50, unique=True)
    diet = models.CharField(max_length=100)
    lifespan = models.PositiveIntegerField()
    behaviour = models.CharField(max_length=500)
    habitat = models.ManyToManyField(Habitat)
    
    def __str__(self):
        return f"{self.species}"
    
    @classmethod
    def create(cls, species, diet, lifespan, behaviour):
        animal = cls(
            species=species,
            diet=diet,
            lifespan=lifespan,
            behaviour=behaviour,
        )
        animal.save()
        return animal

class Zookeeper(models.Model):
    ROLE_TYPES = (
        ('L1', 'Level1'),
        ('L2', 'Level2'),
        ('L3', 'Level3'),
        ('admin', 'Admin'),
    )
    name = models.CharField(max_length=100, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_TYPES, default='L1')
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return f"{self.name}"

class Task(models.Model):
    TASK_TYPES = [
        ('FEEDING', 'Feeding'),
        ('MEDICAL', 'Medical'),
        ('CLEANING', 'Cleaning'),
        ('OTHER', 'Other'),
    ]
    zookeeper = models.ForeignKey(Zookeeper, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    task_type = models.CharField(max_length=50, choices=TASK_TYPES)
    description = models.TextField()
    scheduled_time = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.task_type} for {self.animal.species} by {self.zookeeper.name}"
    
class Membership(models.Model):
    ROLE_TYPES = (
        ('L1', 'Level1 Member'),
        ('L2', 'Level2 Member'),
        ('L3', 'Level3 Member'),
    )
    role = models.CharField(max_length=10, choices=ROLE_TYPES, default='L1')
    detail = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    duration = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.role}"
    
class Visitor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)
    membership = models.ForeignKey(Membership, on_delete=models.SET_NULL, null=True, blank=True)
    membership_start = models.DateField(null=True, blank=True)
    membership_end = models.DateField(null=True, blank=True)

    def renew(self):
        if self.membership:
            today = datetime.now().date()
            if self.membership_end and self.membership_end > today:
                self.membership_end += relativedelta(months=self.membership.duration)
            else:
                self.membership_start = today
                self.membership_end = today + relativedelta(months=self.membership.duration)
            self.save()

    def __str__(self):
        return f"{self.name}"

class Event(models.Model):
    name = models.CharField(max_length=100, unique=True)
    time = models.DateTimeField()
    # price = models.DecimalField(max_digits=10, decimal_places=2)
    # attend = models.ManyToManyField(Visitor, related_name='events')
    memberships = models.ManyToManyField(Membership, related_name='events')

    def discounted(self, visitor):
        if visitor.membership and visitor.membership.discount:
            return self.price * visitor.membership.discount
        return self.price

    def __str__(self):
        return f"{self.name}"
    
class EventFeedback(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()

    def __str__(self):
        return f"Feedback for {self.event.name} by {self.visitor.name} - {self.rating} Stars"
    
class Tour(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    duration = models.DurationField(help_text="Duration in format HH:MM:SS")
    start_time = models.DateTimeField(null=True, blank=True)
    route = models.ManyToManyField(Habitat, through='TourRoute', related_name='tours')
    available_spots = models.PositiveIntegerField(default=20)
    is_scheduled = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} ({self.duration})"
    
    def get_animals(self):
        return Animal.objects.filter(habitat__in=self.route.all()).distinct()
    
    @classmethod
    def schedule_tour(cls, tour_id, start_time):
        tour = cls.objects.get(id=tour_id)
        end_time = start_time + tour.duration 

        for habitat in tour.route.all():
            conflicting_tours = Tour.objects.filter(
                route=habitat,
                is_scheduled=True
            ).annotate(
                end_time=ExpressionWrapper(F('start_time') + F('duration'), output_field=DurationField())
            ).filter(
                Q(start_time__lt=end_time, end_time__gt=start_time)  
            ).exclude(id=tour_id)

            if conflicting_tours.exists():
                return False, f"Scheduling conflict! Habitat '{habitat.name}' is already booked for another tour in this time slot."

        tour.start_time = start_time
        tour.is_scheduled = True
        tour.save()
        return True, "Tour scheduled successfully!"





class TourRoute(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    habitat = models.ForeignKey(Habitat, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    
    class Meta:
        ordering = ['order']
        unique_together = ['tour', 'order']
    
    def __str__(self):
        return f"{self.tour.name} - Stop {self.order}: {self.habitat.name}"

class TourFeedback(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='feedback')
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name='tour_feedback')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    
    def __str__(self):
        return f"Feedback for {self.tour.name} by {self.visitor.name} - {self.rating} Stars"


