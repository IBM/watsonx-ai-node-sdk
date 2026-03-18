export interface MethodsSimpleParams {
  name: string;
  req: {
    url: string;
    params: Record<string, any>;
  };
  callableMethod: (params: any) => Promise<any>;
}

export interface MethodsParams<T> extends MethodsSimpleParams {
  method: T;
  exceptions?: Record<string, any>;
}

export interface MethodsInvalidParams {
  name: string;
  params?: Record<string, any>;
  callableMethod: (params?: any) => Promise<any>;
}
