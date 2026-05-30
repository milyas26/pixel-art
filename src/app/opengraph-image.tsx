import { ImageResponse } from "next/og";

export const alt = "Pixel Art — Photo to Pixel Art Converter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "#e94560",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {[
          ["#e94560", "#0f3460"],
          ["#533483", "#e94560"],
          ["#1a1a2e", "#e94560"],
          ["#e94560", "#16213e"],
          ["#533483", "#16213e"],
        ].map(([fg, bg], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                style={{
                  display: "flex",
                  gap: "2px",
                }}
              >
                {[0, 1, 2, 3].map((col) => (
                  <div
                    key={col}
                    style={{
                      width: "10px",
                      height: "10px",
                      background: (row * 4 + col) % 3 === 0 ? fg : bg,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#e94560",
          letterSpacing: "2px",
        }}
      >
        PIXEL ART
      </div>
      <div
        style={{
          fontSize: "28px",
          color: "#a8a8c8",
          marginTop: "16px",
        }}
      >
        Photo to Pixel Art Converter
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          fontSize: "20px",
          color: "#666",
        }}
      >
        pixelart.bikin.site
      </div>
    </div>,
    { ...size }
  );
}
