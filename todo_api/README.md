# Todo API - Django REST Framework

## Postavljanje projekta

Kreiramo direktorij aplikacije i prebacujemo se u taj direktorij:

- mkdir TodoApp
- cd TodoApp

Kreiramo virtualno okruženje kako bi instalirali samo pakete koji su nam potrebni za aplikaciju:

- `python3 -m venv ime-virtualnog-okruzenja`

Aktivacija virtualnog okruženja potrebna je prije nego se krene u samo izradu projekta:

- Linux -- `source ime-virtualnog-okruzenja/bin/activate`
- Windows -- `'ime-virtualnog-okruzenja\Scripts\activate'`

Instaliramo Django i Django REST Framework:

- `pip install django`
- `pip install djangorestframework`

Dobro je nakon svake instalacije u virtualnom okruženju kopirati sve instalirane pakete u requirements.txt tako da osobe koje dođu na projekt mogu pokrenuti sve potrebne instalacije pomoću komande `pip install -r requirements.txt`.

Spremanje paketa u requirements.txt:

- `pip freeze > requirements.txt`

Kreiramo Django projekt:

- `django-admin startproject todo_api .` (Obratite pažnju da kreiramo projekt u trenutni direktorij ('.'))

Preselimo se u direktorij gdje je naš Django projekt te kreiramo prvu aplikaciju (u jednom django projektu možemo imati više Django aplikacija te je poželjno da svaka aplikacija ima svoju svrhu - npr. todo aplikacija ima svu logiku za todo-e, auth aplikacija bi imala svu logiku vezanu uz autentikaciju i slično):

- `cd todo_api`
- `django-admin startapp todo`
- `cd ..`

Dodajemo `rest_framework` i našu aplikaciju u instalirane aplikacije (`todo_api/settings.py`):

```python
INSTALLED_APPS = [
...

    # place your apps here
    'todo_api.todo',

    'rest_framework',

]
```

## Environment varijable

Važno je organizirati sve osjetljive podatke koji se koriste u aplikaciji.

Za to cemo iskoristiti .env sintaksu:

- `pip install python-dotenv`

Unutar našeg `todo_api` direktorija kreiramo dva nova file-a:

- `touch .env` (ovdje spremamo sve osjetljive podatke koje ne zelimo da ostali vide, OVO SE NE VERZIONIRA!
- `touch .env.example` (ovdje spremamo dummy podatke kako bi osoba koja dolazi na projekt znala sto sebi mora postaviti u .env kako bi mu aplikacija radila, OVO SE VERZIONIRA!)

U `todo_api/settings.py` dodajemo na vrh:

```python
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)
```

## CORS konfiguracija

Kako bi mogli komunicirati sa našim API-jem potrebno je postaviti CORS.

CORS nam omogućava da specificiramo od koga smijemo primati zahtjeve pošto postoje situacije kada cemo htjeti da nas API radi isključivo za našu frontend aplikaciju te želimo da svi vanjski zahtjevi na naš API endpoint budu odbijeni.

Potrebno je dodati paket za corseve:

- `pip install django-cors-headers`

Ažuriramo `todo_api/settings.py`:

```python
INSTALLED_APPS = [
    ...
    # CORS
    'corsheaders',
]

MIDDLEWARE = [
    ...
    # CORS
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]
```

Na dno dodajemo:

```python
# CORS
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    'localhost:3000',
)
```

## PostgreSQL

Dodajemo PostgreSQL bazu s kojom ćemo raditi u našoj aplikaciji.

Instalacija paketa za rad sa PostgreSQL-om ( ukoliko vam komanda ne radi pokrenite `sudo apt-get install libpq-dev` na linuxu ):

- `pip install psycopg2`

Ažuriramo naše environment varijable pošto radimo sa osjetljivim podatcima poput username-a i password-a za pristup bazi podataka.

U `.env` stavljamo prave podatke:

```python
DB_NAME=todo_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
```

Azuriramo `.env.example` kako bi svi znali sto treba postaviti u `.env`:

```python
DB_NAME=db_name
DB_USER=db_username
DB_PASSWORD=db_password
DB_HOST=db_host
DB_PORT=db_port
```

Ažuriramo `todo_api/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USERNAME"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT"),
    }
}
```

> P.S.: Kako bi nam ovo radilo potrebno je kreirati tablicu u pgAdminu jer je inače sustav neće naći i bacati će pogrešku.

Kreiranje modela
Modeli su naše tablice u bazi te ih kreiramo kao objekte.

Model dodajemo u `/todo_api/todo/models.py`:

```python
from django.db import models
from django.utils import timezone

class TodoItem(models.Model):
label = models.CharField(max_length=20)
description = models.CharField(max_length=200)
completed = models.BooleanField(default=False)
created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{label} created at {created_at}.'
```

Nakon svake izmjene nekog od modela potrebno je pokrenuti naredbu koja će detektirati sve promjene i napraviti migraciju kako bi se sve izmjene modela promjenile i u bazi:

- `python manage.py makemigrations --name todo_item_model`

Kreiranu migraciju mozete pronaći u `todo_api/todo/migrations/0001_todo_item_model.py`.

Nakon kreiranja migracije potrebno ju je i pokrenuti kako bi se izmjene doista napravile u bazi:

- `python manage.py migrate`

U bazi možete provjeriti ako se uspješno stvorila vaša tablica.

## Serializers

Kako bi prikazali podatke u obliku JSON-a za naše modele potrebno je koristiti serializer-e koji se brinu da dobijemo točno podatke koje zelimo.

Kreiramo `serializers.py` u `todo_api/todo/` koji će se baviti todo-ima:

```python
from rest_framework import serializers

from .models import TodoItem

class TodoItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = TodoItem
        fields = ('id',
                  'label',
                  'description',
                  'completed',
                  'created_at')
```

## Viewsets

Obrađuju podatke prije slanja na frontend.

Koristimo `ModelViewSet` koji nam omogućavaju sve generičke CRUD operacije (GET, POST, DELETE, CREATE) te dodavanje naših custom operacija.

Dodajemo u `/todo_api/todo/views.py`:

```python
from rest_framework import viewsets

from .models import TodoItem
from .serializers import TodoItemSerializer

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer
    queryset = TodoItem.objects.all()
```

Ako želimo dodati naš custom endpoint u viewset koristimo dekorator `@action` te specificiramo path name da odgovara REST metodologiji.
Kreirat ćemo naš custom action odmah u našu kreiranu klasu `TodoViewSet`:

```python
@action(methods=['GET'], detail=False, url_path='completed', url_name='get_completed_todos')
    def get_completed_todos(self, request):
        completed_todos = self.get_queryset().filter(completed=True)
        serializer = self.get_serializer_class()(completed_todos, many=True)

        if len(completed_todos) <= 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_200_OK)
```

Gore navedena akcija dohvaća sve dovršene todo-e.

## Routeri

Pomoću njih definiramo sto nam vraća koji API endpoint.

Updateamo base url-ove u `/todo_api/urls.py` kako bi postavili da defaultna ruta ('/') ide na naše todo rute:

```python
urlpatterns = [
    ....
    # register base path
    path('', include('todo_api.todo.urls')),
    ....
]
```

Kreiramo `urls.py` u `/todo_api/todo/` te definiramo router koji ce povezati naš API endpoint sa view-om koji će odraditi obradu zahtjeva sa frontenda:

```python
from rest_framework import routers
from django.urls import path, include

from .views import TodoViewSet

router = routers.DefaultRouter()

# generic crud (get, post, create, delete) + custom operations
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('', include(router.urls))
]
```

## Pokretanje i testiranje

Naš API pokrećemo pomoću:

- `python manage.py runserver`

Na [http://localhost:8000](http://localhost:8000/) trebali bi vidjeti sučelje Django REST Frameworka gdje možete isprobati sve endpointove.
