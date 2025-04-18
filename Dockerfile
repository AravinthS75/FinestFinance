# Build stage: Use Maven with Eclipse Temurin JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn clean package -DskipTests

# Run stage: Use Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/springapp-0.0.1-SNAPSHOT.jar ./app.jar
CMD ["java", "-jar", "app.jar"]