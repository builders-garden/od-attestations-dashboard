import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
  pinataGatewayKey: process.env.PINATA_GATEWAY_KEY,
});

/**
 * Upload image to IPFS
 * @param req Request object, must contain a file in the body of the request (e.g. from a form data)
 * @returns IPFS hash of the uploaded image
 */
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 },
      );
    }

    const upload = await pinata.upload.file(file);

    return NextResponse.json({ hash: upload.IpfsHash });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

/**
 * Get image from IPFS
 * @param req Request object, must contain a query parameter "hash" with the IPFS hash of the image
 * @returns Image blob stream
 */
export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const hash = url.searchParams.get("hash");

    if (typeof hash !== "string") {
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    const blob = (await pinata.gateways.get(hash))?.data as Blob;

    if (!blob) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const stream = blob.stream();

    return new NextResponse(stream, {
      headers: {
        "Content-Type": blob.type,
        "Content-Length": blob.size.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
