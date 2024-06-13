"use client";
import { db } from "configs";
import { JsonForms } from "configs/schema";
import React from "react";
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import FormUi from "app/edit-form/[formId]/_components/FormUi";

function LiveAiForm({ params }) {
  const [record, setRecord] = useState();
  const [jsonForm, setJsonForm] = useState(null);

  useEffect(() => {
    params && GetFormData();
  }, [params]);

  const GetFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, Number(params?.formid)));

    const parsedForm = JSON.parse(result[0]?.jsonform || "{}");
    console.log(parsedForm);
    setRecord(result[0]);
    setJsonForm(parsedForm);
    console.log(result);
  };

  return (
    <div
      className="p-10 flex justify-center items-center"
      style={{ backgroundImage: record?.background }}
    >
      {record &&<FormUi
        jsonForm={jsonForm}
        onFieldUpdate={() => console.log}
        deleteField={() => console.log}
        selectedTheme={record?.theme}
        selectedBackground={record?.background}
        editable={false}
        formId={record.id}
      />}
    </div>
  );
}

export default LiveAiForm;
