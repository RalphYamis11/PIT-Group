from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering          = ['email']
    list_display      = ['email', 'first_name', 'last_name', 'is_staff']
    fieldsets         = (
        (None,            {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'address', 'age', 'birthday')}),
        ('Permissions',   {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets     = (
        (None, {
            'classes': ('wide',),
            'fields':  ('email', 'first_name', 'last_name', 'address', 'age', 'birthday', 'password1', 'password2'),
        }),
    )
    search_fields     = ['email', 'first_name', 'last_name']
    filter_horizontal = ()