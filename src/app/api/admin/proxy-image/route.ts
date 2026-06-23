import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_ALLOWED_HOSTS = [
  "pub-cbcc93445b0c42eda9fea9d3440439a2.r2.dev",
  "pacstone.vn",
  "www.pacstone.vn",
];

function getAllowedHosts() {
  const fromEnv =
    process.env.IMAGE_PROXY_ALLOWED_HOSTS?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) || [];

  return new Set([...DEFAULT_ALLOWED_HOSTS, ...fromEnv]);
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing image url" }, { status: 400 });
  }

  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }

  const allowedHosts = getAllowedHosts();

  if (!allowedHosts.has(url.hostname)) {
    return NextResponse.json(
      {
        error: "Host not allowed",
        host: url.hostname,
      },
      { status: 403 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const upstream = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        {
          error: "Cannot fetch image",
          status: upstream.status,
        },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") || "";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "URL is not an image",
          contentType,
        },
        { status: 415 }
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Proxy image request failed" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}