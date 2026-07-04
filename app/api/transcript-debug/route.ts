// ============================================================================
// app/api/transcript-debug/route.ts
// TEMPORARY diagnostic endpoint: runs every transcript-fetching strategy for
// a given video and reports each one's real outcome, so we can see WHY
// fetching fails from Vercel's datacenter IPs (locally everything works).
// Guarded by a static secret. Remove (plus its PUBLIC_PATHS entry in
// proxy.ts) once listening is confirmed working in production.
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export const dynamic = "force-dynamic";

const DEBUG_KEY = "diag-x7k2mQ94pTfw";

type StrategyResult = { ok: boolean; segments?: number; sample?: string; error?: string };

function errMessage(err: unknown): string {
  return err instanceof Error ? `${err.name}: ${err.message}` : String(err);
}

async function tryYoutubeTranscript(videoId: string): Promise<StrategyResult> {
  try {
    const raw = await YoutubeTranscript.fetchTranscript(videoId);
    return { ok: raw.length > 0, segments: raw.length, sample: raw[0]?.text?.slice(0, 60) };
  } catch (err) {
    return { ok: false, error: errMessage(err) };
  }
}

async function tryInnertube(videoId: string, clientType?: string): Promise<StrategyResult> {
  try {
    const { Innertube } = await import("youtubei.js");
    const yt = await Innertube.create({ retrieve_player: false });
    const info = clientType
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await yt.getInfo(videoId, clientType as any)
      : await yt.getInfo(videoId);
    const transcriptInfo = await info.getTranscript();
    const segments = transcriptInfo?.transcript?.content?.body?.initial_segments ?? [];
    return {
      ok: segments.length > 0,
      segments: segments.length,
      sample: segments[0]?.snippet?.text?.slice(0, 60),
    };
  } catch (err) {
    return { ok: false, error: errMessage(err) };
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (key !== DEBUG_KEY) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const videoId = request.nextUrl.searchParams.get("videoId") ?? "arj7oStGLkU";

  const [ytTranscript, innertubeWeb, innertubeAndroid, innertubeTv] = await Promise.all([
    tryYoutubeTranscript(videoId),
    tryInnertube(videoId),
    tryInnertube(videoId, "ANDROID"),
    tryInnertube(videoId, "TV_EMBEDDED"),
  ]);

  return NextResponse.json({
    videoId,
    runtime: process.version,
    strategies: {
      "youtube-transcript": ytTranscript,
      "innertube-web": innertubeWeb,
      "innertube-android": innertubeAndroid,
      "innertube-tv-embedded": innertubeTv,
    },
  });
}
