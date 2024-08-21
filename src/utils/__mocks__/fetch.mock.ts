export const mockFetch = (response: string | Promise<string>) => {
  global.fetch = jest.fn((): Promise<Response> => 
    Promise.resolve({
        text: (): Promise<string> => Promise.resolve(response),
    } as Response)
  );
};
