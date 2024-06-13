"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "configs/AiModel";
import { useUser } from "@clerk/nextjs";
import { db } from "configs";
import { JsonForms } from "configs/schema";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";


const PROMPT = "Based on the provided description, create a JSON format for a form with the following fields formTitle: Title of the form. formHeading: Heading of the form. formSubheading: Subheading of the form. formFields: An array containing objects with the following properties: formName: Name of the form field. fieldType: Type of the field (e.g., 'text', 'radio', 'checkbox', 'select'). fieldLabel: Label for the field. placeholder: Placeholder text for the field (if applicable). name: Name attribute for the field. fieldRequired: Boolean indicating whether the field is required. For radio buttons, checkboxes, and select dropdowns, ensure that the properties formName, fieldType, fieldLabel, placeholder, name, and fieldRequired are always included in the JSON format to ensure consistency and compatibility with the existing codebase."

  

function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setuserInput] = useState();
  const [loading, setloading] = useState();
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {
    console.log(userInput);
    setloading(true);
    const result = await AiChatSession.sendMessage(
      "Description: " + userInput + PROMPT
    );
    console.log(result.response.text());
    if (result.response.text()) {
      const resp = await db
        .insert(JsonForms)
        .values({
          jsonform: result.response.text(),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/yyyy"),
        })
        .returning({ id: JsonForms.id });
      console.log("new form id:", resp[0].id);
      if (resp[0].id) {
        route.push("/edit-form/" + resp[0].id);
      }
      setloading(false);
    }
    setloading(false);
  };

  return (
    <div>
      <Button  onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="my-4"
                placeholder="Write a description of your form .. "
                onChange={(event) => setuserInput(event.target.value)}
              />
              <div className="flex gap-2 my-3 justify-end">
                <Button
                  onClick={() => setOpenDialog(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
                <Button disabled={loading} onClick={() => onCreateForm()}>
                  {loading ? (
                    <Loader2Icon className="animate-spin"></Loader2Icon>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
