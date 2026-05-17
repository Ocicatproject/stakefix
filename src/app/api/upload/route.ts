import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer]);

  const data = new FormData();
  data.append("file", blob, file.name);

  try {
    const pinataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
        },
      }
    );

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${pinataRes.data.IpfsHash}`;
    return NextResponse.json({ ipfsUrl });
  }  catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}

}
