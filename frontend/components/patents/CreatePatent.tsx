"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePrivy } from "@privy-io/react-auth";
import { uploadPatent } from "@/lib/lighthouse";
import { SignaturePad } from "./SignaturePad";

type CreatePatentFormProps = {
  onCreated?: (metadataCid: string) => void;
};

export default function CreatePatentForm({ onCreated }: CreatePatentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCid, setSuccessCid] = useState<string | null>(null);

  // New state for multi-step flow
  const [step, setStep] = useState<"details" | "signature">("details");
  const [signature, setSignature] = useState<string | null>(null);

  const { user } = usePrivy();
  const fallbackWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet",
  ) as { address?: string } | undefined;

  const ownerAddress = user?.wallet?.address ?? fallbackWallet?.address;

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setError("Please attach a PDF before proceeding.");
      return;
    }
    if (!title || !description) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setStep("signature");
  };

  const handleSubmit = async () => {
    if (!signature) {
      setError("Please sign to agree to the terms.");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      setError(null);
      setSuccessCid(null);

      const result = await uploadPatent({
        pdfFile: pdfFile!,
        title,
        description,
        tags: tagList,
        isPublic,
        ownerAddress,
      });

      setSuccessCid(result.metadataCid);
      onCreated?.(result.metadataCid);

      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      setPdfFile(null);
      setIsPublic(true);
      setSignature(null);
      setStep("details");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not upload patent to Lighthouse.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start p-6 min-h-screen animate-fadeIn">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Create New Patent</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "details" ? (
            <form onSubmit={handleContinue} className="flex flex-col gap-6 md:flex-row">
              {/* PDF placeholder left */}
              <div className="flex flex-col flex-shrink-0 justify-center items-center p-4 w-full rounded-lg border border-gray-300 border-dashed md:w-1/3 bg-card">
                <div className="flex justify-center items-center w-24 h-24 rounded-md border-4 border-gray-300 border-dashed">
                  <span className="text-gray-400">PDF</span>
                </div>
                <Input
                  type="file"
                  accept="application/pdf"
                  className="mt-4"
                  onChange={handlePdfChange}
                  disabled={submitting}
                />
                {pdfFile && <p className="mt-2 text-sm">{pdfFile.name}</p>}
              </div>

              {/* Form fields right */}
              <div className="flex flex-col flex-1 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter patent title"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your invention"
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. AI, Robotics, Environment"
                    value={tags}
                    onChange={(e) => setTags(e.currentTarget.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    className="w-4 h-4"
                    disabled={submitting}
                  />
                  <Label htmlFor="isPublic" className="mb-0">
                    Public Patent
                  </Label>
                </div>

                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}

                <Button type="submit" className="mt-4">
                  Continue
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Terms & Conditions
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  By registering this patent, you certify that you are the original author of this work.
                  You agree to the platform's terms of service regarding intellectual property rights.
                  <br /><br />
                  <strong>Usage Conditions:</strong> Any commercial usage of this patent by third parties will require a 5% royalty fee paid to your wallet address.
                </p>
              </div>

              <div className="space-y-4">
                <Label>Sign to confirm registration</Label>
                <SignaturePad onSign={setSignature} />
              </div>

              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              {successCid && (
                <p className="text-sm text-green-600">
                  Patent saved to Lighthouse. Metadata CID: {successCid}
                </p>
              )}

              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setStep("details")} disabled={submitting}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !signature}
                >
                  {submitting ? "Uploading..." : "Create Patent"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
