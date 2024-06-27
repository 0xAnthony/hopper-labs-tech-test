import "./globals.scss";
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import {getConfig} from "@/config";
import {WalletLayout} from "@/components/Wallet/WalletLayout";
import {Toaster} from "react-hot-toast";


export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const initialState = cookieToInitialState(
        getConfig(),
        headers().get('cookie')
    )

    return (
        <html lang="en">
        <body>
        <Toaster
            position="bottom-right"
        />
        <WalletLayout initialState={initialState}>
            {children}
        </WalletLayout>
        </body>
        </html>
    );
}
