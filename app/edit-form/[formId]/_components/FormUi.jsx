import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldEdit from "./FieldEdit";
import { Button } from "@/components/ui/button";
import { db } from "configs";
import { userResponses } from "configs/schema";

import moment from "moment";
import { toast } from "sonner";

function FormUi({
  jsonForm,
  selectedTheme,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
}) {
  console.log("Props received in FormUi:", { jsonForm, selectedTheme, formId });
  const formFields = jsonForm?.formFields || jsonForm?.form || [];
  const [formData, setFormData] = useState();
 
  let formref = useRef();

  //to store the responses
  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    const result = await db.insert(userResponses).values({
      jsonResponse: formData,
      createdAt: moment().format("DD/MM/yy"),
      formref: formId,
    });

    if (result) {
      toast("Response Submitted Successfully !");
    } else {
      toast("Internal server error !");
    }
  };

  const onSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (fieldName, itemName, value) => {
    // Get the current values from formData or initialize an empty array if undefined
    const currentValues = formData[fieldName] || [];

    // Determine the new values based on whether the checkbox is checked or unchecked
    const newValues = value
      ? // If the checkbox is checked, add the itemName with checked status to the current values
        [...currentValues, { label: itemName, value: true }]
      : // If the checkbox is unchecked, remove the itemName from the current values
        currentValues.filter((item) => item.label !== itemName);

    // Update the formData state with the new values for the specified fieldName
    setFormData({
      ...formData,
      [fieldName]: newValues,
    });

    // Log the updated formData for debugging
    console.log(formData);
  };

  return (
    <form
      ref={(e) => (formref = e)}
      onSubmit={onFormSubmit}
      className={`border p-5 mx-auto w-full max-w-[600px] rounded-lg theme-${selectedTheme}`}
      style={{ backgroundColor: "#ffffff" }}
    >
      <h2 className="font-bold text-center text-2xl p-2">
        {jsonForm?.formTitle || ""}
      </h2>
      <h2 className="text-gray-600 text-center text-lg font-semibold">
        {jsonForm?.formHeading || ""}
      </h2>
      <h2 className="text-sm text-gray-500 text-center">
        {jsonForm?.formSubheading || ""}
      </h2>

      {formFields.map((field, index) => (
        <div key={index} className="flex items-center">
          {field.fieldType === "select" || field.FieldType === "select" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-700 block mb-1">
                {field.fieldLabel || field.FieldLabel || field.formLabel}
              </label>

              <Select
                className="my-9"
                required={field?.required}
                onValueChange={(v) => onSelectChange(field.name, v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((item, index) => (
                    <SelectItem key={index} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.fieldType === "radio" ? (
            <div className="my-3 w-full">
              <Label className="text-xs text-gray-700 block mb-1">
                {field.fieldLabel || field.FieldLabel || field.formLabel}
              </Label>
              <RadioGroup required={field?.required}>
                {field.options.map((item, index) => (
                  <div className="flex items-center space-x-2 py-3" key={index}>
                    <RadioGroupItem
                      value={item.label}
                      id={item.label}
                      onClick={() => onSelectChange(field.name, item.label)}
                    />
                    <Label htmlFor={item.label}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.fieldType === "checkbox" ? (
            <div className="my-3 w-full">
              <Label className="text-xs text-gray-700 ">
                {field?.formLabel || field?.fieldLabel}
              </Label>
              {field?.options ? (
                field?.options?.map((item, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <Checkbox
                      onCheckedChange={(v) =>
                        handleCheckboxChange(field?.name, item.label, v)
                      }
                    />
                    <Label className="my-3">{item.label || item.value}</Label>
                  </div>
                ))
              ) : (
                <div className="flex gap-2">
                  <Checkbox required={field?.required} />
                  <h2>{field.label}</h2>
                </div>
              )}
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-700 block mb-1">
                {field.fieldLabel || field.FieldLabel || field.formLabel}
              </label>
              <Input
                type={field.type}
                placeholder={field.placeholder}
                name={field.name || field.fieldName}
                className="w-full"
                required={field?.required}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          )}

          {editable && (
            <div>
              <FieldEdit
                defaultValue={field}
                onUpdate={(value) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>
          )}
        </div>
      ))}
      <Button type="submit" className="btn btn-primary">
        Submit
      </Button>
    </form>
  );
}

export default FormUi;
