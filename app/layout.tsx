import "./globals.css";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import styles from "./page.module.css";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "AsyncAPI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={space_grotesk.className}>
        <nav className={styles.nav}>
          <a href="/">
            <Image
              src="/AsyncAPI.svg"
              alt="AsyncAPI Logo"
              className={styles.vercelLogo}
              width={108}
              height={24}
              priority
              style={{ verticalAlign: "middle" }}
            />
          </a>
          <div>
            <a>
              Docs
              <Image
                src="/arrow-icon.svg"
                alt="AsyncAPI Logo"
                width={20}
                height={20}
                priority
              />
            </a>
            <a>
              Github
              <Image
                src="/arrow-icon.svg"
                alt="AsyncAPI Logo"
                width={20}
                height={20}
                priority
              />
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
