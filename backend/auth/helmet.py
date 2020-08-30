from django.core.handlers.wsgi import WSGIRequest
from rest_framework.response import Response
from rest_framework import status
from .utils import get_class_that_defined_method
class AsterMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.app = 'com.aster'

    
    def __call__(self, request:WSGIRequest):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        return response
    
    def process_view(self, request:WSGIRequest, view_func, view_args, view_kwargs):
        print('process_view is here')
        # XRequestedWith = request.headers.get('X-Requested-With',None)
        # viewclass = get_class_that_defined_method(view_func)
        # res = Response('Reuqest not authorized.', status=status.HTTP_401_UNAUTHORIZED)

        # if not getattr(request, 'accepted_renderer', None):
        #     neg = viewclass().perform_content_negotiation(request, force=True)
        #     request.accepted_renderer, request.accepted_media_type = neg
        #     res.accepted_renderer = request.accepted_renderer
        #     res.accepted_media_type = request.accepted_media_type
        #     res.renderer_context = viewclass().get_renderer_context()

        # if XRequestedWith != self.app:
        #     return res
        # else:
        return None
