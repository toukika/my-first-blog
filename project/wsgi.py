"""
WSGI config for project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application
#
## assuming your django settings file is at '/home/nokkun/mysite/mysite/settings.py'
## and your manage.py is is at '/home/nokkun/mysite/manage.py'
path = '/home/nokkun/soccer_talk'
if path not in sys.path:
    sys.path.append(path)
 
os.environ['DJANGO_SETTINGS_MODULE'] = 'django_app.settings'


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

application = get_wsgi_application()
