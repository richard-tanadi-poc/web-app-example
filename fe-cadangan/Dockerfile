# Using official python runtime base image
FROM python:3.10.5-alpine3.16

# Set the application directory
WORKDIR /app

# Install our requirements.txt
COPY /fe-cadangan/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copy our code from the current folder to /app inside the container
COPY /fe-cadangan /app

# Make port 80 available for links and/or publish
EXPOSE 80

# Define our command to be run when launching the container
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:8080", "--log-file", "-", "--access-logfile", "-", "--workers", "4", "--keep-alive", "0"]
