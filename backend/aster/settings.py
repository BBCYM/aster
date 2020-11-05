"""
Django settings for aster project.

Generated by 'django-admin startproject' using Django 3.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import mongoengine
import json
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SERVER_SECRET')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = json.loads(os.getenv('DEBUG').lower())

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'rest_framework',
    'rest_framework_mongoengine',
    'auth',
    'bot',
    'photo',
    'album',
    'ontology',
    'color_detection',
    # 'line',
    "django.contrib.staticfiles"
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'requestlogs.middleware.RequestLogsMiddleware',
    'auth.helmet.AsterMiddleware',
]

ROOT_URLCONF = 'aster.urls'

WSGI_APPLICATION = 'aster.wsgi.application'

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'zh-TW'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

MONGODB_DATABASES = {
    'default': {
        'name': 'aster',
        'host': 'localhost',
        'port': 27017,
        'tz_aware': USE_TZ,  # if you use timezones in django (USE_TZ = True)
    }
}

mongoengine.connect(
    db=MONGODB_DATABASES['default']['name'],
    host=MONGODB_DATABASES['default']['host'],
    port=MONGODB_DATABASES['default']['port']
)
# redis
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv('REDIS_ADDR'),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": os.getenv('REDIS_PWD'),
        }
    }
}
# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'djongo',
#         'NAME': 'aster',
#         'ENFORCE_SCHEMA': False,
#     }
# }


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'template')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

REST_FRAMEWORK = {
    # Don't use default user
    'UNAUTHENTICATED_USER': None,
    # only render json
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'EXCEPTION_HANDLER': 'requestlogs.views.exception_handler',
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'requestlogs_to_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR + '/log/requestlogs.log',
        },
    },
    'loggers': {
        'requestlogs': {
            'handlers': ['requestlogs_to_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
REQUESTLOGS = {
    'STORAGE_CLASS': 'requestlogs.storages.LoggingStorage',
    'ENTRY_CLASS': 'requestlogs.entries.RequestLogEntry',
    'SERIALIZER_CLASS': 'requestlogs.storages.BaseEntrySerializer',
    'SECRETS': ['password', 'token'],
    'ATTRIBUTE_NAME': '_requestlog',
    'METHODS': ('GET', 'PUT', 'PATCH', 'POST', 'DELETE'),
}

