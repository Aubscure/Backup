#!/usr/bin/env bash

echo "Running migrations and seeders..."
php artisan migrate --force --seed

echo "Linking storage..."
php artisan storage:link

echo "Deployment tasks complete. Starting server..."
