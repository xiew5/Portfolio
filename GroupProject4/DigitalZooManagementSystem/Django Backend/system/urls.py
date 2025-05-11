from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import HabitatViewSet, AnimalViewSet, ZookeeperViewSet, TaskViewSet, MembershipViewSet, VisitorViewSet, EventViewSet, EventFeedbackViewSet, TourViewSet, TourRouteViewSet, TourFeedbackViewSet



router = DefaultRouter()
router.register(r'habitats', HabitatViewSet)
router.register(r'animals', AnimalViewSet)
router.register(r'zookeepers', ZookeeperViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'membership', MembershipViewSet)
router.register(r'visitor', VisitorViewSet)
router.register(r'event', EventViewSet)
router.register(r'eventfeedback', EventFeedbackViewSet)
router.register(r'tour', TourViewSet)
router.register(r'tourroute', TourRouteViewSet)
router.register(r'tourfeedback', TourFeedbackViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('habitats/', views.get_habitats, name='get_habitats'),
    path('habitats/add/', views.add_habitat, name='add_habitat'),
    path('habitats/update/', views.update_habitat, name='update_habitat'),
    path('habitats/delete/', views.delete_habitat, name='delete_habitat'),
    path('habitats/<str:name>/', views.get_habitat_detail, name='get_habitat_detail'),
    path('animals/', views.get_animals, name='get_animals'),
    path('animals/add/', views.add_animal, name='add_animal'),
    path('animals/update/', views.update_animal, name='update_animal'),
    path('animals/delete/', views.delete_animal, name='delete_animal'),
    path('animals/<str:species>/', views.get_animal_detail, name='get_animal_detail'),
    path('zookeepers/delete/', views.delete_zookeeper, name='delete_zookeeper'),
    path('zookeepers/update/', views.update_zookeeper, name='update_zookeeper'),
    path('events/add/', views.add_event, name='add_event'),
    path('create-tour-with-route/', views.create_tour_with_route, name='create-tour-with-route'),
    path('schedule-tour/', views.schedule_tour, name='schedule-tour'),
    path('add-tour-feedback/', views.add_tour_feedback, name='add-tour-feedback'),


    path('api/login/', views.login_visitor, name='login_visitor'),
    path('api/visitor-events/', views.get_visitor_and_events, name='get_visitor_and_events'),
    path('update-membership/<str:visitor_name>/', views.update_visitor_membership),
]

