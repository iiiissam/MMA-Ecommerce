FROM python:3.11-slim

WORKDIR /app

# Hedou tae system | DO NOT TOUCH THIS
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/staticfiles /app/media

EXPOSE 8000

CMD ["gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]

