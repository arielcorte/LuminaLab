"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreatePatentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()),
      pdfFile,
      isPublic,
      address: "TODO: placeholder",
    });
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 animate-fadeIn">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Create New Patent</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* PDF placeholder left */}
            <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center justify-center bg-card p-4 rounded-lg border border-dashed border-gray-300">
              <div className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <span className="text-gray-400">PDF</span>
              </div>
              <Input
                type="file"
                accept="application/pdf"
                className="mt-4"
                onChange={handlePdfChange}
              />
              {pdfFile && <p className="text-sm mt-2">{pdfFile.name}</p>}
            </div>

            {/* Form fields right */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter patent title"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your invention"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g. AI, Robotics, Environment"
                  value={tags}
                  onChange={(e) => setTags(e.currentTarget.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPublic" className="mb-0">
                  Public Patent
                </Label>
              </div>

              <Button type="submit" className="mt-4">
                Create Patent
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
