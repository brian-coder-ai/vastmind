from django.core.management.base import BaseCommand
from django.utils import timezone
from blog.models import Post
from datetime import timedelta

class Command(BaseCommand):
    help = 'Perform scheduled content management tasks'

    def handle(self, *args, **options):
        # Publish scheduled posts
        scheduled_posts = Post.objects.filter(
            status='draft',
            created_at__lte=timezone.now() - timedelta(days=1)
        )
        
        for post in scheduled_posts:
            post.status = 'published'
            post.published_at = timezone.now()
            post.save()
            self.stdout.write(
                self.style.SUCCESS(f'Published scheduled post: {post.title}')
            )

        # Archive old posts (optional)
        old_posts = Post.objects.filter(
            published_at__lte=timezone.now() - timedelta(days=365)
        )
        
        for post in old_posts:
            post.is_archived = True
            post.save()
            self.stdout.write(
                self.style.SUCCESS(f'Archived old post: {post.title}')
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully completed content management tasks')
        )