import { redisStore } from "cache-manager-redis-store";

export const cacheConfig = {  
    isGlobal: true,  
    useFactory: async () => ({  
      store: await redisStore({  
        socket: {  
          host: process.env.REDIS_HOST || 'localhost',  
          port: process.env.REDIS_PORT || 6379,  
        },        
      }),      
    }),    
  }