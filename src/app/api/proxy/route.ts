import { NextResponse } from 'next/server';

async function forwardRequest(request: Request): Promise<NextResponse> {
  const rpcUrl =
    process.env.NEXT_PUBLIC_BLOCKCHAIN_ENVIRONMENT === 'mainnet'
      ? process.env.RPC_MAINNET!
      : process.env.RPC_TESTNET!;

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

  const rpcResponse = await fetch(rpcUrl, {
    method: request.method,
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const data = await rpcResponse.text();
  const response = new NextResponse(data, { status: rpcResponse.status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function GET(request: Request) {
  return forwardRequest(request);
}

export async function POST(request: Request) {
  return forwardRequest(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
