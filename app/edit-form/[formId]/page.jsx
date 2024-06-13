"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "configs";
import { JsonForms } from "configs/schema";
import { eq, and } from "drizzle-orm";
import { RWebShare } from "react-web-share";

import {
  ArrowLeft,
  Share2,
  SquareArrowDownLeftIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "./_components/FormUi";
import { toast } from "sonner";
import Controller from "./_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function EditForm({ params }) {
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState(null);
  const router = useRouter();
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([]);

  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedBackground, setSelectedBackground] = useState();

  const updateControllerFields = async (value, columnName) => {
    const result = await db
      .update(JsonForms)
      .set({
        [columnName]: value,
      })
      .where(
        and(
          eq(JsonForms.id, record?.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    toast("Updated");
  };
  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user]);

  const GetFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(
        and(
          eq(JsonForms.id, params?.formId),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    const parsedForm = JSON.parse(result[0]?.jsonform || "{}");
    console.log(parsedForm);
    setRecord(result[0]);
    setJsonForm(parsedForm);
    setSelectedBackground(result[0]?.background);
  };
  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm);
      updateJosnFormInDb();
    }
  }, [updateTrigger]);

  const onFieldUpdate = (value, index) => {
    jsonForm.form[index].formLabel = value.formLabel;
    jsonForm.form[index].placeholder = value.placeholder;
    console.log(jsonForm);
    setUpdateTrigger(Date.now());
  };

  const updateJosnFormInDb = async () => {
    const result = await db
      .update(JsonForms)
      .set({
        jsonform: jsonForm,
      })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
    console.log(result);
    toast("Updated");
  };

  const deleteField = (indexToRemove) => {
    const result = jsonForm.form.filter(
      (item, index) => index !== indexToRemove
    );
    console.log(result);
    jsonForm.form = result;
    setUpdateTrigger(Date.now());
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h2
          className="flex text-white gap-2 items-center my-5 cursor-pointer hover:font-bold transition-all"
          onClick={() => router.back()}
        >
          <ArrowLeft className="color-white"/>
          Back
        </h2>
        <div className="flex gap-2">
          <Link href={"/aiform/" + record?.id}>
            <Button className="flex gap-2 bg-blue-600  hover:bg-blue-900">
              {" "}
              <SquareArrowOutUpRight className="h-5 w-5" />
              Live Preview
            </Button>
          </Link>
          <RWebShare
            data={{
              text:
                jsonForm?.formHeading +
                " , Build your form in seconds with AI form Builder ",
              url:
                process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
              title: jsonForm?.formTitle,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <Button className="flex gap-2 bg-green-600 hover:bg-green-800 ">
            <Share2 className="h-5 w-5" /> Share
          </Button>
          </RWebShare>
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            setSelectedTheme={(value) => {
              updateControllerFields(value, "theme");
              setSelectedTheme(value);
            }}
            setSelectedBackground={(value) => {
              updateControllerFields(value, "background");
              setSelectedBackground(value);
            }}
          />
        </div>

        <div
          className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center"
          style={{
            backgroundImage: selectedBackground,
          }}
        >
          {jsonForm ? (
            <FormUi
              jsonForm={jsonForm}
              selectedTheme={selectedTheme}
              onFieldUpdate={onFieldUpdate}
              deleteField={(index) => deleteField(index)}
            />
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  );
}

export default EditForm;
