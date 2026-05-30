import { ImageResponse } from "next/og";

export const alt = "Pixel Art — Photo to Pixel Art Converter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function PixelBlock({ pattern, blockSize }: { pattern: number[][]; blockSize: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {pattern.map((row, ri) => (
        <div key={ri} style={{ display: "flex" }}>
          {row.map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: `${blockSize}px`,
                height: `${blockSize}px`,
                background: cell === 1 ? "#f4a261" : cell === 2 ? "#e76f51" : cell === 3 ? "#e9c46a" : "transparent",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const heartPattern = [
  [0, 1, 0, 0, 1, 0],
  [1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 1, 0],
  [0, 0, 1, 1, 0, 0],
];

const starPattern = [
  [0, 0, 1, 0, 0],
  [0, 0, 3, 0, 0],
  [1, 3, 3, 3, 1],
  [0, 1, 3, 1, 0],
  [0, 0, 1, 0, 0],
];

const diamondPattern = [
  [0, 0, 1, 0, 0],
  [0, 1, 3, 1, 0],
  [1, 3, 2, 3, 1],
  [0, 1, 3, 1, 0],
  [0, 0, 1, 0, 0],
];

const swordPattern = [
  [0, 0, 1, 0, 0],
  [0, 1, 3, 0, 0],
  [1, 3, 2, 3, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

const coinPattern = [
  [0, 3, 3, 3, 0],
  [3, 2, 2, 2, 3],
  [3, 2, 1, 2, 3],
  [3, 2, 2, 2, 3],
  [0, 3, 3, 3, 0],
];

const patterns = [heartPattern, starPattern, diamondPattern, swordPattern, coinPattern];

function PixelBorder() {
  const dots: React.ReactNode[] = [];
  const dotSize = 6;
  const gap = 12;
  const colors = ["#f4a261", "#e76f51", "#e9c46a", "#f4a261", "#e76f51"];

  for (let i = 0; i < 1200; i += gap) {
    dots.push(
      <div
        key={`t${i}`}
        style={{
          position: "absolute",
          top: 0,
          left: i,
          width: dotSize,
          height: dotSize,
          background: colors[Math.floor(i / gap) % colors.length],
        }}
      />
    );
    dots.push(
      <div
        key={`b${i}`}
        style={{
          position: "absolute",
          bottom: 0,
          left: i,
          width: dotSize,
          height: dotSize,
          background: colors[(Math.floor(i / gap) + 2) % colors.length],
        }}
      />
    );
  }
  for (let i = 0; i < 630; i += gap) {
    dots.push(
      <div
        key={`l${i}`}
        style={{
          position: "absolute",
          left: 0,
          top: i,
          width: dotSize,
          height: dotSize,
          background: colors[(Math.floor(i / gap) + 1) % colors.length],
        }}
      />
    );
    dots.push(
      <div
        key={`r${i}`}
        style={{
          position: "absolute",
          right: 0,
          top: i,
          width: dotSize,
          height: dotSize,
          background: colors[(Math.floor(i / gap) + 3) % colors.length],
        }}
      />
    );
  }
  return <>{dots}</>;
}

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
        background: "linear-gradient(160deg, #2d1b2e 0%, #5c2a3a 35%, #8b3a3a 70%, #c4553a 100%)",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <PixelBorder />

      <div
        style={{
          display: "flex",
          gap: "32px",
          marginBottom: "36px",
        }}
      >
        {patterns.map((pattern, i) => (
          <PixelBlock key={i} pattern={pattern} blockSize={10} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#f4a261",
            letterSpacing: "6px",
            lineHeight: 1,
          }}
        >
          PIXEL
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#e9c46a",
            letterSpacing: "6px",
            lineHeight: 1,
            marginTop: "4px",
          }}
        >
          ART
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "28px",
          alignItems: "center",
        }}
      >
        <div style={{ width: "40px", height: "4px", background: "#e76f51" }} />
        <div
          style={{
            fontSize: "26px",
            color: "#f5e6d3",
            letterSpacing: "1px",
          }}
        >
          Photo to Pixel Art Converter
        </div>
        <div style={{ width: "40px", height: "4px", background: "#e76f51" }} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "40px",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "16px",
              background: i % 2 === 0 ? "#f4a261" : "#e76f51",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "28px",
          fontSize: "18px",
          color: "#c48a6b",
          letterSpacing: "1px",
        }}
      >
        pixelart.bikin.site
      </div>
    </div>,
    { ...size }
  );
}
