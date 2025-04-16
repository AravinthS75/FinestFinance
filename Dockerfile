# Build stage
FROM maven:3.8.6-openjdk-17 AS build
COPY . /app
WORKDIR /app
RUN mvn clean package

# Run stage
FROM openjdk:17-jdk-slim
COPY --from=build /app/target/springapp-0.0.1-SNAPSHOT.jar /app.jar
CMD ["java", "-jar", "/app.jar"]