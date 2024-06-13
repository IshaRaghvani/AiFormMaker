import { Delete, DeleteIcon, Edit, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function FieldEdit({ defaultValue, onUpdate,deleteField}) {
  const [label, setLabel] = useState(defaultValue?.formLabel);
  const [placeholder, setPlaceholder] = useState(defaultValue?.placeholder);


  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger>
          <Edit className="h-5 w-5 text-gray-500" />
        </PopoverTrigger>
        <PopoverContent>
          <h2 className="font-semibold">Edit Fields</h2>
          <div>
            <label className="text-xs pb-3">Label Name</label>
            <Input
              type="text"
              defaultValue={defaultValue.formLabel}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs">Placeholder Name</label>
            <Input
              type="text"
              defaultValue={defaultValue.placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>

          <Button
            size="sm"
            className="mt-4"
            onClick={() =>
              onUpdate({
                formLabel: label,
                placeholder: placeholder,
              })
            }
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger>
          <Trash2Icon className="h-5 w-5 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>deleteField()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default FieldEdit;
