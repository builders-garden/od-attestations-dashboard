import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "black-gigantic-gayal-622.mypinata.cloud",
});

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
      return NextResponse.json(
        { error: "Failed to get image" },
        { status: 500 },
      );
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
