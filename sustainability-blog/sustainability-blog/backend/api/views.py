from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.utils import timezone
from blog.models import Category, Tag, Post
from .serializers import (
    CategorySerializer, TagSerializer,
    PostListSerializer, PostDetailSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'category__name', 'tags__name']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Post.objects.all()
        if self.action == 'list':
            if not self.request.user.is_staff:
                queryset = queryset.filter(status='published')
        category = self.request.query_params.get('category', None)
        tag = self.request.query_params.get('tag', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostDetailSerializer

    def perform_create(self, serializer):
        if serializer.validated_data.get('status') == 'published':
            serializer.validated_data['published_at'] = timezone.now()
        serializer.save(author=self.request.user)
