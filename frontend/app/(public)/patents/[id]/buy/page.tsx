"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { fetchPatentMetadata } from "@/lib/lighthouse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SignaturePad } from "@/components/patents/SignaturePad";
import Link from "next/link";
import { toast } from "sonner";

type PatentDetails = {
    title: string;
    researcher: string;
    description: string;
    price: string; // Mock price for now
};

export default function BuyPatentPage() {
    const params = useParams();
    const paramId = params?.id;
    const patentId = useMemo(
        () => (Array.isArray(paramId) ? paramId[0] : paramId) || "",
        [paramId],
    );

    const [patent, setPatent] = useState<PatentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [step, setStep] = useState<"agreement" | "confirmation">("agreement");
    const [agreed, setAgreed] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const { authenticated } = usePrivy();
    const router = useRouter();

    useEffect(() => {
        if (!authenticated) {
            router.push(`/patents/${patentId}`);
            return;
        }

        async function loadPatent() {
            if (!patentId) return;
            try {
                setLoading(true);
                const metadata = await fetchPatentMetadata(patentId);
                setPatent({
                    title: metadata.title,
                    researcher: metadata.ownerAddress ?? "Unknown",
                    description: metadata.description,
                    price: "0.05 ETH", // Mock price
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load patent details.");
            } finally {
                setLoading(false);
            }
        }

        loadPatent();
    }, [patentId, authenticated, router]);

    const handlePurchase = async () => {
        if (!agreed || !signature) return;

        setProcessing(true);
        // Simulate purchase delay
        setTimeout(() => {
            setProcessing(false);
            setStep("confirmation");
            toast.success("Patent purchased successfully!");
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !patent) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-red-500 mb-4">{error ?? "Patent not found"}</p>
                <Button asChild variant="outline">
                    <Link href={`/patents/${patentId}`}>Back to Patent</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Button asChild variant="ghost" className="mb-6">
                    <Link href={`/patents/${patentId}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel & Return
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>{step === "agreement" ? "Purchase Patent Rights" : "Purchase Complete"}</CardTitle>
                        <CardDescription>
                            {step === "agreement"
                                ? `You are about to purchase rights for "${patent.title}"`
                                : `You have successfully acquired rights for "${patent.title}"`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {step === "agreement" ? (
                            <>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Transfer of Rights</h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        By purchasing this patent, you are acquiring the <strong>commercial usage rights</strong> from the original researcher.
                                        You acknowledge that all rights to use, distribute, and monetize this invention are being transferred to your wallet address.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Label>Sign to accept transfer</Label>
                                    <SignaturePad onSign={setSignature} />
                                    {signature && (
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            Signature captured
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 pt-4 border-t">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                                        I accept the transfer of usage rights and terms of service
                                    </Label>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Congratulations!</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    The patent rights have been transferred to your wallet. You can now view this patent in your dashboard.
                                </p>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full max-w-sm mt-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Transaction Hash</p>
                                    <code className="text-xs font-mono">0x71C...9A23</code>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {step === "agreement" ? (
                            <Button
                                onClick={handlePurchase}
                                disabled={!agreed || !signature || processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Purchase for ${patent.price}`
                                )}
                            </Button>
                        ) : (
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
