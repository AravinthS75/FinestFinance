# Build stage
FROM maven:3.8.6-jdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/springapp-0.0.1-SNAPSHOT.jar ./app.jar
CMD ["java", "-jar", "app.jar"]