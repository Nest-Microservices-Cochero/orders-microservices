import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  /// 1
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    /// 2
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

/// 3
const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Environment variables validation failed ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  /// 4
  natsServers: envVars.NATS_SERVERS,
};
