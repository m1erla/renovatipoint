# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package -Pprod -DskipTests

# Stage 2: Create the runtime image
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/furkankarakus-0.0.1-SNAPSHOT.jar app.jar

# Copy the .env.prod file
#COPY .env.prod /app/.env.prod
#
# Copy the SSL keystore file
#COPY src/main/resources/combined.p12 /app/combined.p12

# Expose the HTTPS port
EXPOSE 8443

# Run the application
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "-Dspring.config.import=optional:file:.env.prod", "app.jar"]