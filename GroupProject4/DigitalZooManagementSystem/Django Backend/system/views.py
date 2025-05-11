from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from rest_framework.exceptions import ValidationError
from django.http import JsonResponse
from .models import Animal, Habitat, Zookeeper, Task, Membership, Visitor, Event, EventFeedback, TourFeedback, Tour, TourRoute
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import HabitatSerializer, AnimalSerializer, ZookeeperSerializer, TaskSerializer, MembershipSerializer, VisitorSerializer, EventSerializer, EventFeedbackSerializer, TourSerializer, TourRouteSerializer, TourFeedbackSerializer
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime

class HabitatViewSet(viewsets.ModelViewSet):
    queryset = Habitat.objects.all()
    serializer_class = HabitatSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class ZookeeperViewSet(viewsets.ModelViewSet):
    queryset = Zookeeper.objects.all()
    serializer_class = ZookeeperSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        data = self.request.data
        zookeeper_name = data.get("zookeeper")
        animal_species = data.get("animal")

        try:
            zookeeper = Zookeeper.objects.get(name=zookeeper_name)
            animal = Animal.objects.get(species=animal_species)
        except Zookeeper.DoesNotExist:
            raise ValidationError({"error": f"Zookeeper '{zookeeper_name}' not found."})
        except Animal.DoesNotExist:
            raise ValidationError({"error": f"Animal '{animal_species}' not found."})

        task = serializer.save(zookeeper=zookeeper, animal=animal)

        send_mail(
            subject=f"New Task: {task.task_type}",
            message=f"Hello {task.zookeeper.name},\n\nYou have been assigned a new task:\n\n"
                    f"Animal: {task.animal.species}\n"
                    f"Task Type: {task.get_task_type_display()}\n"
                    f"Description: {task.description}\n"
                    f"Scheduled Time: {task.scheduled_time}\n\n"
                    f"Please complete it on time.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[task.zookeeper.email],
        )

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all()
    serializer_class = VisitorSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventFeedbackViewSet(viewsets.ModelViewSet):
    queryset = EventFeedback.objects.all()
    serializer_class = EventFeedbackSerializer

class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

class TourRouteViewSet(viewsets.ModelViewSet):
    queryset = TourRoute.objects.all()
    serializer_class = TourRouteSerializer

class TourFeedbackViewSet(viewsets.ModelViewSet):
    queryset = TourFeedback.objects.all()
    serializer_class = TourFeedbackSerializer

def get_habitats(request):
    habitats = Habitat.objects.all()
    data = []
    for habitat in habitats:
        animals = habitat.animal_set.all()
        data.append({
            'id': habitat.id,
            'name': habitat.name, 
            'size': habitat.size,
            'climate': habitat.climate,
            'animals': [f'{animal.species}, ' for animal in animals]})
    return JsonResponse(data, safe=False)

def add_habitat(request):
    name = request.GET.get('name', '').strip()
    size = request.GET.get('size', '').strip()
    climate = request.GET.get('climate', '').strip()
    
    if not name:
        return JsonResponse({"error": "Habitat name is required."}, status=400)
    if not size:
        return JsonResponse({"error": "Habitat size is required."}, status=400)
    if not climate:
        return JsonResponse({"error": "Habitat climate is required."}, status=400)
    
    try:
        habitat, created = Habitat.objects.get_or_create(
            name=name, 
            defaults={"size": size, "climate": climate}
        )
        
        if not created:
            return JsonResponse({"error": f"Habitat '{name}' already exists."}, status=400)
        
        return JsonResponse({
            "message": "Habitat created successfully!",
            "habitat": {
                "id": habitat.id,
                "name": habitat.name,
                "size": habitat.size,
                "climate": habitat.climate
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

def update_habitat(request):
    name = request.GET.get('name', '').strip()
    new_name = request.GET.get('new_name', '').strip()
    size = request.GET.get('size', '').strip()
    climate = request.GET.get('climate', '').strip()
    
    if not name:
        return JsonResponse({"error": "Current habitat name is required to identify the habitat."}, status=400)
    
    try:
        habitat = get_object_or_404(Habitat, name=name)
        
        if new_name:
            if Habitat.objects.filter(name=new_name).exists() and new_name != name:
                return JsonResponse({"error": f"Habitat with name '{new_name}' already exists."}, status=400)
            habitat.name = new_name
        if size:
            habitat.size = size
        if climate:
            habitat.climate = climate
            
        habitat.save()
        
        return JsonResponse({
            "message": f"Habitat '{name}' updated successfully!",
            "updated_habitat": {
                "id": habitat.id,
                "name": habitat.name,
                "size": habitat.size,
                "climate": habitat.climate
            }
        }, status=200)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

def delete_habitat(request):
    name = request.GET.get('name', '').strip()
    
    if not name:
        return JsonResponse({"error": "Habitat name is required to delete the habitat."}, status=400)
    
    try:
        habitat = get_object_or_404(Habitat, name=name)
        

        if habitat.animal_set.exists():
            return JsonResponse({
                "error": "Cannot delete habitat as it is associated with one or more animals. Remove the animals first."
            }, status=400)
            
        habitat.delete()
        return JsonResponse({"message": f"Habitat '{name}' deleted successfully!"}, status=200)
    except Habitat.DoesNotExist:
        return JsonResponse({"error": f"No habitat found with the name '{name}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

def get_habitat_detail(request, name):
    try:
        habitat = get_object_or_404(Habitat, name=name)
        animals = [
            {
                "id": animal.id,
                "species": animal.species
            }
            for animal in habitat.animal_set.all()
        ]
        
        data = {
            "id": habitat.id,
            "name": habitat.name,
            "size": habitat.size,
            "climate": habitat.climate,
            "animals": animals
        }
        return JsonResponse(data)
    except Habitat.DoesNotExist:
        return JsonResponse({"error": f"No habitat found with the name '{name}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


def get_animals(request):
    animals = Animal.objects.all()
    data = [
        {
            "id": animal.id,
            "species": animal.species,
            "diet": animal.diet,
            "lifespan": animal.lifespan,
            "behaviour": animal.behaviour,
            "habitats": [habitat.name for habitat in animal.habitat.all()]
        }
        for animal in animals
    ]
    return JsonResponse(data, safe=False)

def add_animal(request):
    species = request.GET.get('species', '').strip()
    diet = request.GET.get('diet', '').strip()
    lifespan = request.GET.get('lifespan', '').strip()
    behaviour = request.GET.get('behaviour', '').strip()
    habitats = request.GET.get('habitats', '').strip()
    
    if not species:
        return JsonResponse({"error": "Animal species is required."}, status=400)
    if not diet:
        return JsonResponse({"error": "Animal diet is required."}, status=400)
    if not lifespan:
        return JsonResponse({"error": "Animal lifespan is required."}, status=400)
    if not behaviour:
        return JsonResponse({"error": "Animal behaviour is required."}, status=400)
    
    try:
        lifespan_value = int(lifespan)
        if lifespan_value <= 0:
            return JsonResponse({"error": "Lifespan must be a positive integer."}, status=400)
    except ValueError:
        return JsonResponse({"error": "Lifespan must be a valid integer."}, status=400)
    
    if Animal.objects.filter(species=species).exists():
        return JsonResponse({"error": f"Animal with species '{species}' already exists."}, status=400)
    
    animal = Animal.create(
        species=species,
        diet=diet,
        lifespan=lifespan_value,
        behaviour=behaviour
    )
    
    if habitats:
        habitat_names = [h.strip() for h in habitats.split(',')]
        found_habitats = Habitat.objects.filter(name__in=habitat_names)
        
        if len(found_habitats) != len(habitat_names):
            missing = set(habitat_names) - set(h.name for h in found_habitats)
            animal.delete()  
            return JsonResponse({
                "error": f"Some habitats were not found: {', '.join(missing)}"
            }, status=404)
        
        animal.habitat.set(found_habitats)
    
    return JsonResponse({
        "message": "Animal created successfully!",
        "animal": {
            "id": animal.id,
            "species": animal.species,
            "diet": animal.diet,
            "lifespan": animal.lifespan,
            "behaviour": animal.behaviour,
            "habitats": [habitat.name for habitat in animal.habitat.all()]
        }
    }, status=201)

def update_animal(request):
    species = request.GET.get('species', '').strip()
    new_species = request.GET.get('new_species', '').strip()
    diet = request.GET.get('diet', '').strip()
    lifespan = request.GET.get('lifespan', '').strip()
    behaviour = request.GET.get('behaviour', '').strip()
    habitats = request.GET.get('habitats', '').strip()
    
    if not species:
        return JsonResponse({"error": "Current animal species is required to identify the animal."}, status=400)
    
    try:
        animal = get_object_or_404(Animal, species=species)
        
        if new_species:
            if Animal.objects.filter(species=new_species).exists() and new_species != species:
                return JsonResponse({"error": f"Animal with species '{new_species}' already exists."}, status=400)
            animal.species = new_species
        
        if diet:
            animal.diet = diet
            
        if lifespan:
            try:
                lifespan_value = int(lifespan)
                if lifespan_value <= 0:
                    return JsonResponse({"error": "Lifespan must be a positive integer."}, status=400)
                animal.lifespan = lifespan_value
            except ValueError:
                return JsonResponse({"error": "Lifespan must be a valid integer."}, status=400)
                
        if behaviour:
            animal.behaviour = behaviour
            
        animal.save()
        
        if habitats:
            habitat_names = [h.strip() for h in habitats.split(',')]
            found_habitats = Habitat.objects.filter(name__in=habitat_names)
            
            if len(found_habitats) != len(habitat_names):
                missing = set(habitat_names) - set(h.name for h in found_habitats)
                return JsonResponse({
                    "error": f"Some habitats were not found: {', '.join(missing)}"
                }, status=404)
            
            animal.habitat.set(found_habitats)
        
        return JsonResponse({
            "message": f"Animal '{species}' updated successfully!",
            "updated_animal": {
                "id": animal.id,
                "species": animal.species,
                "diet": animal.diet,
                "lifespan": animal.lifespan,
                "behaviour": animal.behaviour,
                "habitats": [habitat.name for habitat in animal.habitat.all()]
            }
        }, status=200)
    except Animal.DoesNotExist:
        return JsonResponse({"error": f"No animal found with the species '{species}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

def delete_animal(request):
    species = request.GET.get('species', '').strip()
    
    if not species:
        return JsonResponse({"error": "Animal species is required to delete the animal."}, status=400)
    
    try:
        animal = get_object_or_404(Animal, species=species)
        animal.delete()
        return JsonResponse({"message": f"Animal '{species}' deleted successfully!"}, status=200)
    except Animal.DoesNotExist:
        return JsonResponse({"error": f"No animal found with the species '{species}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

def get_animal_detail(request, species):
    try:
        animal = get_object_or_404(Animal, species=species)
        habitats = [
            {
                "id": habitat.id,
                "name": habitat.name
            }
            for habitat in animal.habitat.all()
        ]
        
        data = {
            "id": animal.id,
            "species": animal.species,
            "diet": animal.diet,
            "lifespan": animal.lifespan,
            "behaviour": animal.behaviour,
            "habitats": habitats
        }
        return JsonResponse(data)
    except Animal.DoesNotExist:
        return JsonResponse({"error": f"No animal found with the species '{species}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    

def delete_zookeeper(request):
    name = request.GET.get('name', '').strip()
    
    if not name:
        return JsonResponse({"error": "Name is required to delete the zookeeper."}, status=400)
    
    try:
        zookeeper = get_object_or_404(Zookeeper, name=name)
        zookeeper.delete()
        return JsonResponse({"message": f"Zookeeper '{name}' deleted successfully!"}, status=200)
    except Animal.DoesNotExist:
        return JsonResponse({"error": f"No zookeeper found with the name '{name}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    
def update_zookeeper(request):
    name = request.GET.get('name', '').strip()
    new_name = request.GET.get('new_name', '').strip()
    role = request.GET.get('role', '').strip()
    email = request.GET.get('email', '').strip()

    if not name:
        return JsonResponse({"error": "Current zookeeper name is required to identify the zookeeper."}, status=400)
    
    try:
        zookeeper = get_object_or_404(Zookeeper, name=name)
        
        if new_name:
            if Zookeeper.objects.filter(name=new_name).exists() and new_name != name:
                return JsonResponse({"error": f"Zookeeper with name '{new_name}' already exists."}, status=400)
            zookeeper.name = new_name
        
        if role:
            if role not in dict(Zookeeper.ROLE_TYPES).keys():
                return JsonResponse({"error": f"Invalid role. Available roles are: {', '.join(dict(Zookeeper.ROLE_TYPES).keys())}"}, status=400)
            zookeeper.role = role
            
        if email:
            if Zookeeper.objects.filter(email=email).exists() and email != zookeeper.email:
                return JsonResponse({"error": f"A zookeeper with email '{email}' already exists."}, status=400)
            zookeeper.email = email
        
        zookeeper.save()
        
        return JsonResponse({
            "message": f"Zookeeper '{name}' updated successfully!",
            "updated_zookeeper": {
                "id": zookeeper.id,
                "name": zookeeper.name,
                "role": zookeeper.role,
                "email": zookeeper.email
            }
        }, status=200)
    
    except Zookeeper.DoesNotExist:
        return JsonResponse({"error": f"No zookeeper found with the name '{name}'."}, status=404)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


def add_event(request):
    name = request.GET.get('name', '').strip()
    time = request.GET.get('time', '').strip()
    membership_roles = request.GET.get('memberships', '').strip().split(",")
    try: 
        memberships = Membership.objects.filter(role__in=membership_roles)
        visitors = Visitor.objects.filter(membership__in=memberships).values('name', 'email')
        visitor_list = list(visitors)
        emails = [visitor['email'] for visitor in visitors]
        print(visitor_list)
        event = Event.objects.create(
            name=name,
            time=time,
            )
        event.memberships.set(memberships)
        send_mail(
            subject=f"New Event: {event.name}",
            message=f"Hello dear member!\n\nWe would like to inform you that there is a new event!\n"
                    f"Time: {event.time}\n"
                    "We hope you are looking forward to it!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=emails,
        )
        return JsonResponse({
            "message": "Event created successfully!",
            "animal": {
                "id": event.id,
                "name": event.name,
                "time": event.time,
                "memberships": [membership.role for membership in event.memberships.all()],
                "visitors": visitor_list
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)
    

@api_view(['POST'])
def login_visitor(request):
    name = request.data.get('name')
    password = request.data.get('password')

    try:
        visitor = Visitor.objects.get(name=name, password=password)
        return Response({'success': True, 'message': 'Login successful'})
    except Visitor.DoesNotExist:
        return Response({'success': False, 'message': 'Invalid name or password'}, status=400)

def get_visitor_and_events(request):
    visitor_name = request.GET.get('name')
    if not visitor_name:
        return JsonResponse({'success': False, 'message': 'Name is required'}, status=400)

    visitor = get_object_or_404(Visitor, name=visitor_name)
    membership = visitor.membership
    
    if not membership:
        return JsonResponse({'success': False, 'message': 'No membership associated with this visitor'}, status=400)

    membership_role = membership.role
    
    if membership_role == 'L1':
        events = Event.objects.filter(memberships__role='L1')
    elif membership_role == 'L2':
        events = Event.objects.filter(memberships__role__in=['L1', 'L2'])
    elif membership_role == 'L3':
        events = Event.objects.filter(memberships__role__in=['L1', 'L2', 'L3'])
    else:
        events = Event.objects.none()

    event_list = [{'id': event.id, 'name': event.name, 'time': event.time} for event in events]

    return JsonResponse({
        'success': True,
        'name': visitor.name,
        'membership': membership.role,
        'events': event_list
    })

#renew
@api_view(['PUT'])
def update_visitor_membership(request, visitor_name):
    try:
        visitor = Visitor.objects.get(name=visitor_name)
    except Visitor.DoesNotExist:
        return Response({'error': 'Visitor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    role = request.data.get('membership_id')
    start_date = request.data.get('membership_start_date')
    end_date = request.data.get('membership_end_date')

    if role and start_date and end_date:
        try:
            membership = Membership.objects.get(role=role)
        except Membership.DoesNotExist:
            return Response({'error': 'Membership role not found'}, status=status.HTTP_400_BAD_REQUEST)

        visitor.membership = membership
        visitor.membership_start = start_date
        visitor.membership_end = end_date
        visitor.save()

        return Response({'message': 'Membership updated successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_tour_with_route(request):
    tour_data = {
        'name': request.data.get('name'),
        'description': request.data.get('description'),
        'duration': request.data.get('duration'),
        'available_spots': request.data.get('available_spots', 20)
    }
    
    route_data = request.data.get('route', [])
    start_time_str = request.data.get('start_time')
    
    if not tour_data['name'] or not tour_data['description'] or not tour_data['duration']:
        return Response(
            {"error": "Name, description, and duration are required for the tour"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not route_data:
        return Response(
            {"error": "Route is required with at least one habitat"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not start_time_str:
        return Response(
            {"error": "Start time is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        start_time = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M")
    except ValueError:
        return Response(
            {"error": "Invalid start_time format. Use 'YYYY-MM-DD HH:mm' format"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        tour_serializer = TourSerializer(data=tour_data)
        if tour_serializer.is_valid():
            tour = tour_serializer.save(start_time=start_time)
            
            for route_item in route_data:
                habitat_id = route_item.get('habitat')
                order = route_item.get('order')
                
                TourRoute.objects.create(
                    tour=tour,
                    habitat_id=habitat_id,
                    order=order
                )

            tour_with_details = Tour.objects.get(id=tour.id)
            return Response(
                {
                    "tour": TourSerializer(tour_with_details).data,
                    "animals": [{"id": animal.id, "species": animal.species} for animal in tour.get_animals()]
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            tour_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def schedule_tour(request):
    tour_id = request.data.get('tour_id')
    start_time_str = request.data.get('start_time')

    if not tour_id or not start_time_str:
        return Response({"error": "Both tour_id and start_time are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        tour = Tour.objects.get(id=tour_id)
    except Tour.DoesNotExist:
        return Response({"error": f"Tour with ID {tour_id} not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        start_time = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M")
    except ValueError:
        return Response({"error": "Invalid start_time format. Use 'YYYY-MM-DD HH:mm' format"}, status=status.HTTP_400_BAD_REQUEST)

    success, message = Tour.schedule_tour(tour_id, start_time)

    if success:
        return Response({"message": message, "scheduled_time": start_time}, status=status.HTTP_200_OK)
    else:
        return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def add_tour_feedback(request):
    tour_id = request.data.get('tour_id')
    visitor_name = request.data.get('visitor_name')
    rating = request.data.get('rating')
    comment = request.data.get('comment', '')
    
    if not tour_id or not visitor_name or not rating:
        return Response(
            {"error": "tour_id, visitor_id, and rating are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        tour = Tour.objects.get(id=tour_id)
        visitor = Visitor.objects.get(name=visitor_name)
        
        feedback = TourFeedback.objects.create(
            tour=tour,
            visitor=visitor,
            rating=rating,
            comment=comment
        )
        
        return Response({
            "message": "Feedback submitted successfully",
            "feedback": TourFeedbackSerializer(feedback).data
        }, status=status.HTTP_201_CREATED)
    
    except Tour.DoesNotExist:
        return Response(
            {"error": f"Tour with ID {tour_id} not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Visitor.DoesNotExist:
        return Response(
            {"error": f"Visitor with ID {visitor_name} not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

