import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)

/// Implementamos otro mas simple ExceptionFilter
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    /// Hacer una respuesta

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    /// en base al erro que recibimos responder con algo apropiado
    const rpcError = exception.getError();

    console.log('RpcCustomExceptionFilter', rpcError);

    /// Validar que vengas las propiedades en los errores como las hemos definido y dinamicamente responder con el status residido
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      // forma simple, const status = rpcError['status'];
      const status = isNaN(+rpcError.status) ? 400 : +rpcError['status'];

      return response.status(status).json(rpcError);
    }

    /// Si no, responder con un mensaje genérico y código 400
    response.status(400).json({
      statusCode: 400,
      message: rpcError,
    });
  }
}
