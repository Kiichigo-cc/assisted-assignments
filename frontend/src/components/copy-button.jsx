import { toast } from "sonner";
import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Attempt to copy the text to the clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        toast("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast("Failed to copy to clipboard");
      });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      {copied ? <Check /> : <Clipboard />}
    </Button>
  );
};

export default CopyButton;
