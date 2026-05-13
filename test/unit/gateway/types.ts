export interface MethodsSimpleParams {
  name: string;
  req: {
    url: string;
    params: Record<string, any>;
  };
  callableMethod: (params: any) => Promise<any>;
}

export interface MethodsParams extends MethodsSimpleParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  exceptions?: Record<string, any>;
  expectedPath?: Record<string, any>;
  expectedBody?: Record<string, any>;
  expectedQs?: Record<string, any>;
  customHeaders?: Record<string, any>;
}

export interface MethodsInvalidParams {
  name: string;
  params?: Record<string, any>;
  callableMethod: (params?: any) => Promise<any>;
}
