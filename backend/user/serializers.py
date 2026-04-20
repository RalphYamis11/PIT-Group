from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from djoser.serializers import UserSerializer as DjoserUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model  = User
        fields = ('id', 'email', 'first_name', 'last_name', 'address', 'age', 'birthday', 'password')


class UserSerializer(DjoserUserSerializer):
    class Meta(DjoserUserSerializer.Meta):
        model  = User
        fields = ('id', 'email', 'first_name', 'last_name', 'address', 'age', 'birthday', 'is_staff', 'is_superuser')
        read_only_fields = ('email', 'is_staff', 'is_superuser')