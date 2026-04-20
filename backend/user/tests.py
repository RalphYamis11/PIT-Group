from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomUserModelTest(TestCase):

    def test_create_user_with_email(self):
        """Regular user is created with email as the login field."""
        user = User.objects.create_user(
            email='testuser@gmail.com',
            password='testpass123',
            first_name='Juan',
            last_name='dela Cruz',
        )
        self.assertEqual(user.email, 'testuser@gmail.com')
        self.assertEqual(user.first_name, 'Juan')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_requires_email(self):
        """Creating a user without email raises ValueError."""
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password='testpass123')

    def test_create_superuser(self):
        """Superuser has is_staff and is_superuser set to True."""
        admin = User.objects.create_superuser(
            email='admin@gmail.com',
            password='adminpass123',
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_active)

    def test_user_str_returns_email(self):
        """String representation of user is their email."""
        user = User.objects.create_user(
            email='hello@gmail.com',
            password='pass1234',
        )
        self.assertEqual(str(user), 'hello@gmail.com')

    def test_user_optional_fields(self):
        """Address, age, and birthday are optional."""
        user = User.objects.create_user(
            email='optional@gmail.com',
            password='pass1234',
            address='123 Street, CDO',
            age=20,
            birthday='2004-01-15',
        )
        self.assertEqual(user.address, '123 Street, CDO')
        self.assertEqual(user.age, 20)
        self.assertIsNotNone(user.birthday)

    def test_email_is_normalized(self):
        """Email domain is lowercased on save."""
        user = User.objects.create_user(
            email='Test@GMAIL.COM',
            password='pass1234',
        )
        self.assertEqual(user.email, 'Test@gmail.com')

    def test_username_field_is_email(self):
        """USERNAME_FIELD should be email."""
        self.assertEqual(User.USERNAME_FIELD, 'email')

    def test_required_fields_is_empty(self):
        """REQUIRED_FIELDS should be empty since email is USERNAME_FIELD."""
        self.assertEqual(User.REQUIRED_FIELDS, [])