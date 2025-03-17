# Build stage
FROM maven:3.8.5-openjdk-17 AS build

# Set working directory
WORKDIR /app

# Debug - list what files are available in the build context
RUN ls -la

# Copy everything to the container (adjust if you need to exclude files)
COPY . .

# Debug - verify what got copied
RUN ls -la

# Build the application
RUN mvn clean package -DskipTests

# Create necessary directories
RUN mkdir -p /app/invoices /app/uploads

# Runtime stage
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app

# Create user
RUN useradd -m javauser

# Copy the built artifact
COPY --from=build /app/target/furkankarakus-0.0.1-SNAPSHOT.jar /app/furkankarakus.jar

# Copy the SSL keystore
COPY --from=build /app/src/main/resources/combined.p12 /app/combined.p12

# Copy directories
COPY --from=build /app/invoices /app/invoices
COPY --from=build /app/uploads /app/uploads

# Set proper permissions
RUN chown -R javauser:javauser /app

# Switch to non-root user
USER javauser

EXPOSE 8443
ENTRYPOINT ["java","-jar","furkankarakus.jar"]