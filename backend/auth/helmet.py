from django.core.handlers.wsgi import WSGIRequest
from rest_framework.response import Response
from rest_framework import status
from .utils import get_class_that_defined_method
import os
import base64
import hashlib
import hmac
class AsterMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.app = os.getenv('APP')
        self.access_code = os.getenv('ACCESS_CODE')

    
    def __call__(self, request:WSGIRequest):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        return response
    
    def process_view(self, request:WSGIRequest, view_func, view_args, view_kwargs):
        XRequestedWith = request.headers.get('X-Requested-With',None)
        Authorization = request.headers.get('Authorization',None)
        LineSignature = request.headers.get('X-Line-Signature', None)
        if LineSignature:
            channel_secret = os.getenv('LINE_CHANNEL_SECRET')
            hashval = hmac.new(channel_secret.encode('utf-8'),str(request.body).encode('utf-8'), hashlib.sha256).digest()
            signature = base64.b64encode(hashval)
            if LineSignature != signature:
                return ResWith401(request, view_func)
        elif XRequestedWith != self.app or Authorization != self.access_code:
            return ResWith401(request, view_func)
        return None

def ResWith401(request, view_func):
    res = Response('Reuqest not authorized.', status=status.HTTP_401_UNAUTHORIZED)
    if not getattr(request, 'accepted_renderer', None):
        viewclass = get_class_that_defined_method(view_func)
        neg = viewclass().perform_content_negotiation(request, force=True)
        request.accepted_renderer, request.accepted_media_type = neg
        res.accepted_renderer = request.accepted_renderer
        res.accepted_media_type = request.accepted_media_type
        res.renderer_context = viewclass().get_renderer_context()
    return res
