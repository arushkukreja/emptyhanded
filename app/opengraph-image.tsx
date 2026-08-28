import { ImageResponse } from "next/og";

export const alt = "EmptyHanded — Never show up empty handed again";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #fffaf0 0%, #f3eadc 55%, #f6bd60 140%)",
        color: "#101a2e",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>
          emptyhanded<span style={{ color: "#f59e0b" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 900, letterSpacing: -5, lineHeight: 0.94, marginTop: 56 }}>
          <span>Never show up</span>
          <span>empty handed <span style={{ color: "#e89100", fontStyle: "italic" }}>again.</span></span>
        </div>
        <div style={{ color: "#596273", display: "flex", fontSize: 26, lineHeight: 1.45, marginTop: 42 }}>
          Thoughtful gift ideas, remembered and timed for the people who matter.
        </div>
      </div>
    </div>,
    size
  );
}
