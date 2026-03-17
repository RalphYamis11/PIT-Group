from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.db import connection

# Health check endpoint
def health_check(request):
    try:
        connection.ensure_connection()
        db_status = "connected"
    except Exception:
        db_status = "error"

    return JsonResponse({
        "status": "ok",
        "database": db_status
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('enrollment.urls')),
    path('health/', health_check),
]