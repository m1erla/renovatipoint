# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package -Pprod -DskipTests

# Create necessary directories
RUN mkdir -p /app/invoices /app/uploads

# Runtime stage
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app

# Create user (if needed)
RUN useradd -m javauser

# Copy the built artifact and directories
COPY --from=build /app/target/furkankarakus-0.0.1-SNAPSHOT.jar /app/furkankarakus.jar
COPY --from=build /app/invoices /app/invoices
COPY --from=build /app/uploads /app/uploads

# Set proper permissions
RUN chown -R javauser:javauser /app

# Switch to non-root user
USER javauser

EXPOSE 8443
ENTRYPOINT ["java","-jar","furkankarakus.jar"]