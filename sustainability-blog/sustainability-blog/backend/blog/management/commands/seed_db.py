from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from blog.models import Category, Tag, Post
from django.db import transaction

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')
            self.stdout.write(self.style.SUCCESS('Superuser created'))

        # Create categories
        categories = [
            {'name': 'Zero Waste', 'description': 'Tips and guides for reducing waste'},
            {'name': 'Renewable Energy', 'description': 'Information about renewable energy sources'},
            {'name': 'Eco-Friendly Living', 'description': 'Daily practices for sustainable living'},
        ]
        
        created_categories = []
        for cat in categories:
            category, created = Category.objects.get_or_create(
                name=cat['name'],
                defaults={'description': cat['description']}
            )
            created_categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create tags
        tags = ['sustainability', 'eco-friendly', 'green-living', 'renewable', 'recycling']
        created_tags = []
        for tag_name in tags:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            created_tags.append(tag)
            if created:
                self.stdout.write(f'Created tag: {tag.name}')

        # Create sample posts
        posts = [
            {
                'title': 'Getting Started with Zero Waste',
                'content': 'Here are some tips to begin your zero waste journey...',
                'excerpt': 'Begin your journey to a zero waste lifestyle with these simple steps.',
                'category': created_categories[0],
                'is_featured': True,
                'status': 'published'
            },
            {
                'title': 'Solar Power for Beginners',
                'content': 'Understanding solar power and its benefits...',
                'excerpt': 'Learn the basics of solar power and how to get started.',
                'category': created_categories[1],
                'is_featured': True,
                'status': 'published'
            },
            {
                'title': 'Daily Eco-Friendly Habits',
                'content': 'Simple habits that can make a big difference...',
                'excerpt': 'Small changes in your daily routine can have a big impact on the environment.',
                'category': created_categories[2],
                'is_featured': True,
                'status': 'published'
            },
        ]

        # Get or create the author
        author = User.objects.get(username='admin')

        # Create posts
        for post_data in posts:
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                defaults={
                    'content': post_data['content'],
                    'excerpt': post_data['excerpt'],
                    'category': post_data['category'],
                    'author': author,
                    'is_featured': post_data['is_featured'],
                    'status': post_data['status'],
                    'published_at': timezone.now()
                }
            )
            if created:
                post.tags.add(*created_tags[:3])  # Add first 3 tags to each post
                self.stdout.write(f'Created post: {post.title}')

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully'))