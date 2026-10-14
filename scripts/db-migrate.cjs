require('dotenv').config({path:'.env.local',quiet:true});
const {spawnSync}=require('node:child_process');
const env={...process.env,DATABASE_URL:process.env.DATABASE_URL_UNPOOLED||process.env.DATABASE_URL};
const result=spawnSync('npx.cmd',['prisma','migrate','deploy'],{env,stdio:'inherit',shell:true});
process.exit(result.status||0);
