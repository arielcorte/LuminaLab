"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreatePatentForm from "./CreatePatent";

export function OpenCreatePatentInline() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
        {!open &&(
            <Button size="lg" onClick={() => setOpen(true)}>
                Create New Patent
            </Button>
    ) }

      {open && (
        <>
          <Button
            variant="ghost"
            className=""
            size="lg"
            onClick={() => setOpen(false)}
            >
            Close Form
          </Button>
          <CreatePatentForm />
        </>
      )}
    </div>
  );
}
