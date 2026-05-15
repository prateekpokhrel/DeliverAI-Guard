FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy only the files needed for a Maven build first (speeds up caching)
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

# Build the project (skip tests for faster builds in CI; remove -DskipTests if you want tests run)
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java","-jar","app.jar"]