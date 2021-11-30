import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import neo4j from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      useFactory: async () => {
        const typeDefs = readFileSync('schema/schema.graphql', 'utf-8');

        const driver = neo4j.driver(
          process.env.NEO4J_SERVER,
          neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
        );

        const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
        return {
          debug: true,
          playground: true,
          schema: neoSchema.schema,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
