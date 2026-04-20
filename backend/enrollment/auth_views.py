from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login using email and password."""
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'No account found with this email.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Authenticate with username
    user = authenticate(request, username=user.username, password=password)
    if user is None:
        return Response(
            {'error': 'Incorrect password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response({
        'message': 'Login successful.',
        'user': {
            'id':         user.id,
            'username':   user.username,
            'email':      user.email,
            'first_name': user.first_name,
            'last_name':  user.last_name,
            'full_name':  f"{user.first_name} {user.last_name}".strip() or user.username,
            'is_staff':   user.is_staff,
            'date_joined': user.date_joined,
        }
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """Logout the current user."""
    logout(request)
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get current logged-in user's profile."""
    user = request.user
    return Response({
        'id':         user.id,
        'username':   user.username,
        'email':      user.email,
        'first_name': user.first_name,
        'last_name':  user.last_name,
        'full_name':  f"{user.first_name} {user.last_name}".strip() or user.username,
        'is_staff':   user.is_staff,
        'date_joined': user.date_joined,
        'last_login':  user.last_login,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    """Check if the user is currently logged in."""
    if request.user.is_authenticated:
        user = request.user
        return Response({
            'authenticated': True,
            'user': {
                'id':         user.id,
                'username':   user.username,
                'email':      user.email,
                'first_name': user.first_name,
                'last_name':  user.last_name,
                'full_name':  f"{user.first_name} {user.last_name}".strip() or user.username,
                'is_staff':   user.is_staff,
                'date_joined': user.date_joined,
                'last_login':  user.last_login,
            }
        })
    return Response({'authenticated': False})
