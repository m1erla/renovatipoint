FROM maven:3.8.5-openjdk-17 AS build
COPY . .
FROM openjdk:17.0.1-jdk-slim
VOLUME /tmp
COPY target/furkankarakus-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8080