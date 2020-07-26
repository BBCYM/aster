from djongo import models
import datetime

class User(models.Model):
    userId = models.CharField(max_length=100,primary_key=True)
    expiresAt = models.DateTimeField(null=True,blank=True)
    refreshToken=models.CharField(max_length=512,blank=False)
    lastUpdateTime=models.DateTimeField(auto_now=True)
    lastSync=models.DateTimeField(null=True, blank=True)
    isSync=models.BooleanField(default=False)
