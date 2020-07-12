from django.db import models
import datetime

class User(models.Model):
    userId = models.CharField(max_length=100,blank=False,unique=True)
    # accessToken= models.CharField(max_length=2048,blank=False)
    # refreshTime=models.DateTimeField(auto_now_add=True,blank=False)
    expiresAt = models.DateTimeField(blank=True)
    refreshToken=models.CharField(max_length=512,blank=False)
    lastUpdateTime=models.DateTimeField(auto_now=True)
