import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import localFont from "next/font/local";

const raleway = localFont({
  src: "./fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
});

// const siteUrl = "";
// export const metadata: Metadata = {
//   metadataBase: new URL(siteUrl),
//   title: {
//     default: "",
//     template: "%s | ",
//   },
//   description:
//     "At Les Délices By Akorfa, we believe that life’s best moments deserve a sweet touch that is both delicious and mindful. From intimate birthdays to grand celebrations, we bring your vision to life with whipped-cream perfection and wholesome ingredients",
//   keywords: [
//     "EleventhFactor",
//     "fashion",
//     "kaftan",
//     "suits",
//     "Ghana fashion",
//     "urban style",
//     "ethical fashion",
//     "modern wear",
//   ],
//   robots: {
//     index: true,  // ✅ IMPORTANT: Explicitly allow indexing
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//     },
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: siteUrl,
//     siteName: "lesdelicesbyakorfa",
//     title: "lesdelicesbyakorfa",
//     description:
//       "Premium fashion brand offering kaftans, suits, and urban style clothing",
//     images: [
//       {
//         url: "/opengraph-image.png",
//         width: 1200,
//         height: 630,
//         alt: "EleventhFactor Clothing",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "EleventhFactor",
//     description: "Premium fashion brand offering kaftans, suits, and urban style clothing",
//     images: ["/opengraph-image.png"],
//   },
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <ClerkProvider>
          <main className="overflow-hidden">{children}</main>
        </ClerkProvider>
         <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#db9d2a", color: "#ffffff" },
            }}
          />
      </body>
    </html>
  );
}
